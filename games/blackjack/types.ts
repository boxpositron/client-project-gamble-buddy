import { Sound } from "@pixi/sound";
import { type Container, type Sprite } from "pixi.js";

import { type Card, type SupportedDeck, SupportedDecks } from "~/data/deck";
import { type GameSound } from "~/data/game";

export type CardSprite = {
    card: Card;
    container: Container;
    frontSprite: Sprite;
    backSprite: Sprite;
};

export type CardSprites = Record<string, CardSprite>;

export const CardSprites: Record<SupportedDeck, CardSprites> = {
    [SupportedDecks.WHITE]: {},
    [SupportedDecks.BLACK]: {},
};

export type SoundSprites = Record<GameSound, Sound>;

export const PlayerTypes = {
    dealer: "dealer",
    player: "player",
} as const;

export type PlayerType = (typeof PlayerTypes)[keyof typeof PlayerTypes];

export type ItemPosition = {
    x: number;
    y: number;
};

export type ItemSize = {
    width: number;
    height: number;
};

export type SetupPlayerOptions = {
    type: PlayerType;
    getCard: () => CardSprite;
    onDeal?: () => void;
};
