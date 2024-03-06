import { Assets, Sprite, Container } from "pixi.js";

import { getDeck, type SupportedDeck } from "~/data/deck";

import { type ItemSize, CardSprites } from "../types";

const SCALE_FACTOR = 0.8;

const CardSize: ItemSize = {
    width: 200,
    height: 300,
};

function applySizeScaleFactor(size: number, scaleFactor: number): number {
    return size * scaleFactor;
}

export async function loadDeckSprites(
    type: SupportedDeck,
): Promise<CardSprites> {
    if (Object.keys(CardSprites[type]).length > 0) {
        return CardSprites[type];
    }

    const deck = getDeck(type);

    Assets.add({ alias: "deck", src: deck.back });

    for (const card of deck.cards) {
        Assets.add({ alias: card.name, src: card.path });
    }

    const cardNames = deck.cards.map((card) => card.name);

    const texturesPromise = await Assets.load(["deck", ...new Set(cardNames)]);


    const deckSprites: CardSprites = {};

    for (const card of deck.cards) {
        const container = new Container();


        container.width = applySizeScaleFactor(CardSize.width, SCALE_FACTOR);
        container.height = applySizeScaleFactor(CardSize.height, SCALE_FACTOR);

        const frontSprite = Sprite.from(texturesPromise[card.name]);
        const backSprite = Sprite.from(texturesPromise.deck);

        frontSprite.width = applySizeScaleFactor(CardSize.width, SCALE_FACTOR);
        frontSprite.height = applySizeScaleFactor(CardSize.height, SCALE_FACTOR);

        backSprite.width = applySizeScaleFactor(CardSize.width, SCALE_FACTOR);
        backSprite.height = applySizeScaleFactor(CardSize.height, SCALE_FACTOR);

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
