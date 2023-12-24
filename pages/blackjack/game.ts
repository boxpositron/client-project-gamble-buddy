import { unref } from "#imports"
import { Sound } from '@pixi/sound';
import gsap, { Power1 } from "gsap";
import { Sprite, Container, Texture, Graphics, Text } from "pixi.js";


import {
    getDeck,
    type Card,
    CardSuits,
    type CardSuit,
    SupportedDecks,
    type SupportedDeck,
} from "~/data/deck";



import { GameSounds, GameSoundLibrary, type GameSound } from "~/data/game"

import { PlayerTypes, type PlayerType, type CardSprite, type CardSprites, type SoundSprites, type ItemPosition, type ItemSize, type SetupPlayerOptions } from "./types"

import { sleep } from "./utils"


export function setupGame() {

    // Asset Sizes and Positions Start Here

    const DispenserSize: ItemSize = {
        width: 200,
        height: 300
    }

    const DispenserLocation: ItemPosition = {
        x: window.innerWidth - 100,
        y: (window.innerHeight / 2) - (DispenserSize.height / 2)
    }

    const CardSize: ItemSize = {
        width: 200,
        height: 300
    }

    const ScoreCardSize: ItemSize = {
        width: 200,
        height: 50
    }


    // Asset Sizes and Positions End Here


    async function setupStage(refCanvas: Ref<HTMLDivElement | null>) {
        const canvas = unref(refCanvas);


        if (!canvas) {
            return;
        }

        const { Application } = await import("pixi.js")


        const { loadGameSounds } = await useSoundLoader();

        const sounds = await loadGameSounds();

        const app = new Application({
            resizeTo: window,
            background: 0x35654d,
            backgroundAlpha: 1,
            autoDensity: true,
            resolution: window.devicePixelRatio || 1,
        });

        canvas?.appendChild(app.view as unknown as Node);


        const dispenser = createDispenser();
        app.stage.addChild(dispenser);


        const cards = loadDeckSprites(SupportedDecks.WHITE);
        const shuffled = shuffleDeck(cards);


        const getCard = (): CardSprite => {

            const latestKey = Object.keys(shuffled)[0];

            const latestCard = shuffled[latestKey];
            delete shuffled[latestKey];

            return latestCard;
        }



        const onDeal = () => {
            sounds[GameSounds.DispenseCard].play();
        }

        const { deal: dealHouse, playerContainer: house } = setupPlayer({ type: PlayerTypes.dealer, getCard, onDeal });
        const { deal: dealPlayer, playerContainer: player } = setupPlayer({ type: PlayerTypes.player, getCard, onDeal });

        app.stage.addChild(house);
        app.stage.addChild(player);
        app.stage.eventMode = 'dynamic';

        // Deal initial cards
        dealHouse();
        await sleep(500);
        dealPlayer();
        await sleep(500);
        dealHouse({ hide: true });
        await sleep(500);
        dealPlayer();

    }


    function createDispenser() {
        const Dispenser = new Container();

        Dispenser.width = DispenserSize.width;
        Dispenser.height = DispenserSize.height;

        Dispenser.x = window.innerWidth - 100;
        Dispenser.y = (window.innerHeight / 2) - (DispenserSize.height / 2);

        const DispenserGraphics = new Graphics();

        DispenserGraphics.lineStyle(0);
        DispenserGraphics.beginFill(0x000000);
        DispenserGraphics.drawRoundedRect(0, 0, 200, 300, 20);
        DispenserGraphics.endFill();

        Dispenser.addChild(DispenserGraphics);

        return Dispenser;
    }



    function setupPlayer(setupOptions: SetupPlayerOptions) {
        let totalCardsDealt = 0;
        const spacing = 20;


        const scoreCard = new Container();
        const scoreGraphics = new Graphics();
        const playerContainer = new Container();

        scoreGraphics.beginFill(0xffffff, 0.5);
        scoreGraphics.drawRoundedRect(0, 0, ScoreCardSize.width, ScoreCardSize.height, 5);
        scoreGraphics.endFill();


        const scoreText = new Text("0", { fontSize: 30, align: "center" });

        scoreText.x = 7.5;
        scoreText.y = 7.5;

        scoreGraphics.addChild(scoreText);

        // playerContainer.width = 700;
        // playerContainer.height = 400;

        switch (setupOptions.type) {
            case PlayerTypes.dealer: {
                // Lets center the dealer
                playerContainer.x = 100
                playerContainer.y = 50;



                scoreCard.x = 0;
                scoreCard.y = playerContainer.y + 300;

                break;
            }

            case PlayerTypes.player: {
                // Lets center the player
                playerContainer.x = 100
                playerContainer.y = window.innerHeight - 400;



                scoreCard.x = 0;
                scoreCard.y = -100;
                break;
            }
        }

        scoreCard.addChild(scoreGraphics);
        playerContainer.addChild(scoreCard);



        type DealOptions = {
            interactive?: boolean
            hide?: boolean
        }

        const DEFAULT_DEAL_OPTIONS: DealOptions = {
            interactive: true,
            hide: false
        }

        const dealtCards: (Card & {
            hidden: boolean
        })[] = [];

        const getTotalValue = (reveal: boolean = false): number => {
            let total = 0;

            for (const card of dealtCards) {
                if (card.hidden && !reveal) {
                    continue;
                }

                if (Array.isArray(card.value)) {

                    const minValue = Math.min(...card.value);
                    const maxValue = Math.max(...card.value);

                    if (total + maxValue > 21) {
                        total += minValue;
                        continue
                    }

                    total += maxValue;
                    continue;
                }



                total += card.value;
            }

            return total;
        }


        function deal(dealOptions?: DealOptions) {
            const config = Object.assign({}, DEFAULT_DEAL_OPTIONS, dealOptions);

            const latestCard = setupOptions.getCard();



            latestCard.container.x = DispenserLocation.x;
            latestCard.container.y = DispenserLocation.y;


            const targetX = (totalCardsDealt * latestCard.container.width) + (totalCardsDealt * spacing) + 100;
            const targetY = 150

            // Remove card after dealing

            const isFlipped = ref<boolean>(true);

            const flipContainerSprite = () => {
                if (isFlipped.value) {
                    latestCard.container.removeChild(latestCard.frontSprite);
                    latestCard.container.addChild(latestCard.backSprite);
                    isFlipped.value = false;
                    return
                }


                latestCard.container.removeChild(latestCard.backSprite);
                latestCard.container.addChild(latestCard.frontSprite);
                isFlipped.value = true;
            }



            const flipCard = () => {


                // const flip = gsap.to(latestCard.container, {
                //     duration: .2,
                //     ease: Power1.easeInOut,
                //     onComplete: () => {
                //         flipContainerSprite();
                //     }
                // });

                // flip.play();
            }

            if (config.hide) {
                flipContainerSprite();
            }


            const handleFlip = () => {
                console.log("handle flip")
                if (!config.interactive) {
                    flipCard();
                }
            }


            latestCard.container.on("click", handleFlip);
            latestCard.container.on("tap", handleFlip);


            playerContainer.addChild(latestCard.container);

            totalCardsDealt += 1;

            dealtCards.push({
                ...latestCard.card,
                hidden: config.hide || false
            });



            const tween = gsap
                .fromTo(latestCard.container, {
                    x: DispenserLocation.x,
                    y: DispenserLocation.y,
                    rotation: isFlipped ? Math.PI * 2 : 0,

                }, {
                    x: targetX,
                    y: targetY,
                    rotation: isFlipped ? 0 : Math.PI * 2,
                    duration: .5,
                    ease: Power1.easeIn,
                    onComplete: () => {
                        const score = getTotalValue();
                        scoreText.text = score.toString();
                    }
                })
                ;

            // Start the animation

            tween.play();

            // Play sound
            if (setupOptions.onDeal) {
                setupOptions.onDeal();
            }


            return {
                flipCard
            }


        }

        return {
            deal,
            playerContainer
        }

    }


    const CardSprites: Record<SupportedDeck, CardSprites> = {
        [SupportedDecks.WHITE]: {},
        [SupportedDecks.BLACK]: {},
    };


    function loadDeckSprites(type: SupportedDeck): CardSprites {


        if (Object.keys(CardSprites[type]).length > 0) {
            return CardSprites[type];
        }

        const deck = getDeck(type);

        const deckSprites: CardSprites = {};


        for (const card of deck.cards) {


            const container = new Container();

            container.name = card.name;

            container.width = CardSize.width;
            container.height = CardSize.height;

            const frontTexture = Texture.from(card.path);
            const backTexture = Texture.from(deck.back);

            const frontSprite = new Sprite(frontTexture);
            const backSprite = new Sprite(backTexture);

            frontSprite.width = CardSize.width;
            frontSprite.height = CardSize.height;

            backSprite.width = CardSize.width;
            backSprite.height = CardSize.height;

            frontSprite.anchor.set(0.5);
            backSprite.anchor.set(0.5);

            frontSprite.position.set(0, 0);
            backSprite.position.set(0, 0);

            container.addChild(frontSprite);

            deckSprites[card.name] = {
                card,
                container,
                frontSprite,
                backSprite,

            };

        }

        Object.assign(CardSprites[type], deckSprites);

        return deckSprites;
    }


    function shuffleDeck(cards: CardSprites): CardSprites {
        const shuffledCards: CardSprites = {};

        const cardNames = Object.keys(cards);

        while (cardNames.length > 0) {
            const randomIndex = Math.floor(Math.random() * cardNames.length);
            const randomCardName = cardNames.splice(randomIndex, 1)[0];

            shuffledCards[randomCardName] = cards[randomCardName];
        }

        return shuffledCards;
    }

    return {
        setupStage
    }


}

async function useSoundLoader() {
    const { sound, Sound } = await import("@pixi/sound");

    function loadSounds(gameSound: GameSound): Promise<Sound> {

        const soundPath = GameSoundLibrary[gameSound];

        let resolve: (value: Sound | PromiseLike<Sound>) => void;
        const promise = new Promise<Sound>((res) => {
            resolve = res;
        })

        const soundItem = Sound.from({
            url: soundPath,
            preload: true,
            loaded: function (err) {
                const soundObject = sound.add(gameSound, soundItem);
                resolve(soundObject);
            }
        });


        return promise;
    }

    async function loadGameSounds(): Promise<SoundSprites> {

        const soundSprites: SoundSprites = {
            [GameSounds.BlackJackWinner]: await loadSounds(GameSounds.BlackJackWinner),
            [GameSounds.DispenseCard]: await loadSounds(GameSounds.DispenseCard),
        };

        return soundSprites;
    }

    return {
        loadGameSounds
    }
}
