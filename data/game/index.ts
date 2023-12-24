const BlackJackWinner = "/audio/blackjack/winner.mp3";
const DispenseCard = "/audio/blackjack/dispense.mp3";

export const GameSounds = {
    BlackJackWinner: "blackjack-winner",
    DispenseCard: "dispense-card",
} as const

export type GameSound = typeof GameSounds[keyof typeof GameSounds];

export const GameSoundLibrary: Record<GameSound, string> = {
    [GameSounds.BlackJackWinner]: BlackJackWinner,
    [GameSounds.DispenseCard]: DispenseCard,
}