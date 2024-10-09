export interface Book {
    abbrev: {
        "pt": string,
        "en": string
    },
    author: string,
    chapters: number,
    group: string,
    name: string,
    testament: string
}

export interface BookSimple {
    name: string;
    author: string;
}

export interface Verse {
    number: number;
    text: string;
}