import { Sound } from "@pixi/sound";

import { GameSounds, GameSoundLibrary, type GameSound } from "~/data/game";

import { type SoundSprites } from "../types";

export async function useSoundLoader() {
  const { sound, Sound } = await import("@pixi/sound");

  function loadSounds(gameSound: GameSound): Promise<Sound> {
    const soundPath = GameSoundLibrary[gameSound];

    let resolve: (value: Sound | PromiseLike<Sound>) => void;
    const promise = new Promise<Sound>((res) => {
      resolve = res;
    });

    const soundItem = Sound.from({
      url: soundPath,
      preload: true,
      loaded: function (err) {
        if (err) {
          console.error(err);
          return;
        }

        const soundObject = sound.add(gameSound, soundItem);
        resolve(soundObject);
      },
    });

    return promise;
  }

  async function loadGameSounds(): Promise<SoundSprites> {
    const soundSprites: SoundSprites = {
      [GameSounds.BlackJackWinner]: await loadSounds(
        GameSounds.BlackJackWinner,
      ),
      [GameSounds.DispenseCard]: await loadSounds(GameSounds.DispenseCard),
    };

    return soundSprites;
  }

  return {
    loadGameSounds,
  };
}
