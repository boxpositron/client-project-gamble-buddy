import { twMerge } from "tailwind-merge";

export type ElementClass = { [key: string]: boolean };


export default (elementclass: ElementClass): string => {
    const activeClasses = Object.keys(elementclass)
        .filter((key) => elementclass[key])
        .map((key) => key);

    return twMerge(activeClasses);

}
