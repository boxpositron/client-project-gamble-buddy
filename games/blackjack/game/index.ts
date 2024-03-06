import { onKeyStroke } from "@vueuse/core";
import gsap, { Power1 } from "gsap";
import { Application, Container, Graphics, Text } from "pixi.js";

import { type Card, SupportedDecks } from "~/data/deck";

import { loadDeckSprites } from "~/games/blackjack/sprites";
// import { useSoundLoader } from "~/pages/blackjack/sound";

// import { GameSounds } from "~/data/game";

import {
    PlayerTypes,
    // type PlayerType,
    type CardSprite,
    type CardSprites,
    type ItemPosition,
    type ItemSize,
    type SetupPlayerOptions,
} from "../types";

class GameScoreInstance {
    private dealerScore: number = 0;
    private playerScore: number = 0;

    public resetScores() {
        this.dealerScore = 0;
        this.playerScore = 0;
    }

    public getDealerScore() {
        return this.dealerScore;
    }

    public getPlayerScore() {
        return this.playerScore;
    }

    public updateDealerScore(score: number) {
        this.dealerScore = score;
    }

    public updatePlayerScore(score: number) {
        this.playerScore = score;
    }
}


const DispenserSize: ItemSize = {
    width: 200,
    height: 300,
};

const DispenserLocation: ItemPosition = {
    x: window.innerWidth - 100,
    y: window.innerHeight / 2 - DispenserSize.height / 2,
};
const ScoreCardSize: ItemSize = {
    width: 50,
    height: 50,
};

const waitForRefElement = async (ref: Ref<HTMLElement | null>) => {
    return new Promise<HTMLElement>((resolve) => {
        const interval = setInterval(() => {
            if (ref.value) {

                if (ref.value instanceof HTMLElement) {
                    clearInterval(interval);
                    resolve(ref.value);
                }
            }
        }, 100);
    });
}


// Asset Sizes and Positions Start Here

// Asset Sizes and Positions End Here

export async function setupStage(element: Ref<HTMLDivElement | null>) {


    const canvas = await waitForRefElement(element);


    const CANVASWIDTH = canvas.clientWidth;
    const CANVASHEIGHT = canvas.clientHeight || window.innerHeight - 100;


    const gameScores = new GameScoreInstance();
    const cards = await loadDeckSprites(SupportedDecks.WHITE);
    //
    // const { loadGameSounds } = await useSoundLoader();
    //
    // const sounds = await loadGameSounds();

    // Remove 200px from max screen height

    const app = new Application()

    await app.init(
        {
            height: CANVASHEIGHT,
            width: CANVASWIDTH,
            background: 0x35654d,
            backgroundAlpha: 1,
            autoDensity: true,
            resolution: window.devicePixelRatio || 1,
        });

    canvas.appendChild(app.canvas);


    const shuffled = shuffleDeck(cards);

    const decisionMenu = useDecisionMenu(app);

    const { deal: dealHouse, playerContainer: house } = setupPlayer({
        type: PlayerTypes.dealer,
        getCard,
        onDeal,
    });

    const { deal: dealPlayer, playerContainer: player } = setupPlayer({
        type: PlayerTypes.player,
        getCard,
        onDeal,
    });

    app.stage.addChild(house);
    app.stage.addChild(player);
    app.stage.eventMode = "dynamic";

    function onDeal() {
        // sounds[GameSounds.DispenseCard].play();
        decisionMenu.showMenu();
    }
    // Deal initial cards
    function checkIfBust(score: number = 0): boolean {
        if (score > 21) {
            return true;
        }

        return false;
    }

    function getCard(): CardSprite {
        const latestKey = Object.keys(shuffled)[0];

        const latestCard = shuffled[latestKey];
        delete shuffled[latestKey];

        return latestCard;
    }

    function dealAndScore() {
        decisionMenu.hideMenu();
        const { score: playerScore } = dealPlayer();
        const { truevalue: houseScore } = dealHouse({ hide: true });

        gameScores.updatePlayerScore(playerScore);
        gameScores.updateDealerScore(houseScore);

        const isPlayerBust = checkIfBust(playerScore);
        const isDealerBust = checkIfBust(houseScore);

        if (isPlayerBust) {
            console.log("Player Bust");
            return;
        }

        if (isDealerBust) {
            console.log("Dealer Bust");
            return;
        }
    }

    onKeyStroke(" ", dealAndScore);

    // Deal initial cards
    dealHouse();
    dealPlayer();

    // Deal New Cards;
    dealAndScore();
}

function useDecisionMenu(app: Application) {
    // Show decision menu

    const screenContainer = new Container();
    const screenGraphics = new Graphics();

    const menuContainer = new Container();
    const menuGraphics = new Graphics();

    menuContainer.addChild(menuGraphics);

    // We want the screen container to be the size of the entire screen

    screenContainer.width = app.stage.width;
    screenContainer.height = app.stage.height;

    screenGraphics.fill({ color: 0x000000, alpha: 0.5 });
    screenGraphics.rect(0, 0, app.stage.width, app.stage.height);

    screenContainer.addChild(screenGraphics);

    screenContainer.addChild(menuContainer);


    const width = 600;
    const height = 300;

    menuContainer.x = app.stage.width / 2 - width / 2;
    menuContainer.y = app.stage.height / 2 - height / 2;

    function showMenu() {

        app.stage.addChild(screenContainer);
    }

    function hideMenu() {
        app.stage.removeChild(screenContainer);
    }

    return {
        showMenu,
        hideMenu,
    };
}

function setupPlayer(setupOptions: SetupPlayerOptions) {
    let totalCardsDealt = 0;
    const spacing = 20;

    const scoreCard = new Container();
    const scoreGraphics = new Graphics();
    const playerContainer = new Container();

    const scoreText = new Text({
        text: "0",
        style: {
            fontSize: ScoreCardSize.width / 2,
            align: "center",
        }
    });

    scoreText.x = ScoreCardSize.width / 4 - scoreText.width / 2;
    scoreText.y = ScoreCardSize.height / 2 - scoreText.height / 2;

    scoreCard.x = 20;

    // playerContainer.width = 700;
    // playerContainer.height = 400;

    const absoluteWindowTop = window.innerHeight / 2 - 400;
    const absoluteWindowBottom = window.innerHeight / 2 + 400;

    switch (setupOptions.type) {
        case PlayerTypes.dealer: {
            // Lets center the dealer
            playerContainer.x = window.innerWidth / 2 - 350;
            playerContainer.y = absoluteWindowTop;

            scoreCard.y = -40;

            scoreGraphics.fill({ color: 0xb6dcfe, alpha: 0.5 });

            break;
        }

        case PlayerTypes.player: {
            // Lets center the player
            playerContainer.x = window.innerWidth / 2 - 350;
            playerContainer.y = absoluteWindowBottom - 300;

            // Relative to the player

            scoreCard.y = -40;

            scoreGraphics.fill({ color: 0xb6dcfe, alpha: 0.5 });

            break;
        }
    }
    scoreGraphics.roundRect(0, 0, ScoreCardSize.width, ScoreCardSize.height, 5);

    scoreCard.addChild(scoreGraphics);
    scoreCard.addChild(scoreText);

    playerContainer.addChild(scoreCard);

    type DealOptions = {
        interactive?: boolean;
        hide?: boolean;
    };

    const DEFAULT_DEAL_OPTIONS: DealOptions = {
        interactive: true,
        hide: false,
    };

    const dealtCards: (Card & {
        hidden: boolean;
    })[] = [];

    function getTotalValue(reveal: boolean = false): number {
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
                    continue;
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

        const targetX =
            totalCardsDealt * latestCard.container.width +
            totalCardsDealt * spacing +
            100;
        const targetY = 150;

        // Remove card after dealing

        const isFlipped = ref<boolean>(true);

        const flipContainerSprite = () => {
            if (isFlipped.value) {
                latestCard.container.removeChild(latestCard.frontSprite);
                latestCard.container.addChild(latestCard.backSprite);
                isFlipped.value = false;
                return;
            }

            latestCard.container.removeChild(latestCard.backSprite);
            latestCard.container.addChild(latestCard.frontSprite);
            isFlipped.value = true;
        };

        const flipCard = () => {
            // const flip = gsap.to(latestCard.container, {
            //     duration: .2,
            //     ease: Power1.easeInOut,
            //     onComplete: () => {
            //         flipContainerSprite();
            //     }
            // });
            // flip.play();
        };

        if (config.hide) {
            flipContainerSprite();
        }

        const handleFlip = () => {
            console.log("handle flip");
            if (!config.interactive) {
                flipCard();
            }
        };

        latestCard.container.on("click", handleFlip);
        latestCard.container.on("tap", handleFlip);

        playerContainer.addChild(latestCard.container);

        totalCardsDealt += 1;

        dealtCards.push({
            ...latestCard.card,
            hidden: config.hide || false,
        });

        const tween = gsap.fromTo(
            latestCard.container,
            {
                x: DispenserLocation.x,
                y: DispenserLocation.y,
                rotation: isFlipped ? Math.PI * 2 : 0,
            },
            {
                x: targetX,
                y: targetY,
                rotation: isFlipped ? 0 : Math.PI * 2,
                duration: 0.5,
                ease: Power1.easeIn,
                onComplete: () => {
                    const score = getTotalValue();
                    scoreText.text = score.toString();
                },
            },
        );
        // Start the animation

        tween.play();

        // Play sound
        if (setupOptions.onDeal) {
            setupOptions.onDeal();
        }

        return {
            flipCard,
            score: getTotalValue(),
            truevalue: getTotalValue(true),
        };
    }

    return {
        deal,
        playerContainer,
    };
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

