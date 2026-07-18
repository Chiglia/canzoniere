import { Injectable } from '@angular/core';

export interface ChordSegment {
    chord: string;
    text: string;
}

const NOTE_TO_SEMITONE: { [key: string]: number } = {
    // International
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11,
    // Italian
    'Do': 0, 'Do#': 1, 'Reb': 1, 'Re': 2, 'Re#': 3, 'Mib': 3, 'Mi': 4, 'Fa': 5, 'Fa#': 6, 'Solb': 6, 'Sol': 7, 'Sol#': 8, 'Lab': 8, 'La': 9, 'La#': 10, 'Sib': 10, 'Si': 11
};

const ALL_NOTE_KEYS = [
    'Sol#', 'Solb', 'La#', 'Sib', 'Do#', 'Reb', 'Re#', 'Mib', 'Fa#', 'Solb', 'Lab',
    'Sol', 'Do', 'Re', 'Mi', 'Fa', 'La', 'Si',
    'C#', 'Db', 'D#', 'Eb', 'F#', 'Gb', 'G#', 'Ab', 'A#', 'Bb',
    'C', 'D', 'E', 'F', 'G', 'A', 'B'
];

@Injectable({
    providedIn: 'root'
})
export class ChordService {
    public intlChords = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'Cm', 'Dm', 'Em', 'Am', 'G7', 'C7', 'D7', 'A7'];
    public itChords = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si', 'Do-', 'Re-', 'Mi-', 'La-', 'Sol7', 'Do7', 'Re7', 'La7'];

    transposeContent(text: string, semitones: number, targetNotation: 'it' | 'intl'): string {
        return text.replace(/\[([^\]]+)\]/g, (match, chord) => {
            const transposed = this.transposeChord(chord, semitones, targetNotation);
            return `[${transposed}]`;
        });
    }

    private transposeChord(chord: string, semitones: number, targetNotation: 'it' | 'intl'): string {
        if (chord.includes('/')) {
            const parts = chord.split('/');
            return parts.map(p => this.transposeChordPart(p, semitones, targetNotation)).join('/');
        }
        return this.transposeChordPart(chord, semitones, targetNotation);
    }

    private transposeChordPart(part: string, semitones: number, targetNotation: 'it' | 'intl'): string {
        part = part.trim();
        if (!part) return '';

        let matchedKey = '';
        for (const key of ALL_NOTE_KEYS) {
            if (part.startsWith(key)) {
                matchedKey = key;
                break;
            }
        }

        if (!matchedKey) {
            return part;
        }

        const semitone = NOTE_TO_SEMITONE[matchedKey];
        const suffix = part.substring(matchedKey.length);
        const newSemitone = (semitone + semitones + 12) % 12;

        let newNote = '';
        if (targetNotation === 'it') {
            const itNotes = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];
            newNote = itNotes[newSemitone];
        } else {
            const intlNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
            newNote = intlNotes[newSemitone];
        }

        return newNote + suffix;
    }

    getParsedLines(content: string, transposeOffset: number, targetNotation: 'it' | 'intl', activeNotation: 'it' | 'intl') {
        if (!content) return [];

        const processedContent = transposeOffset === 0 && targetNotation === activeNotation
            ? content
            : this.transposeContent(content, transposeOffset, targetNotation);

        const lines = processedContent.split('\n');
        return lines.map(line => {
            if (!line.trim()) {
                return [{ chord: '', text: ' ' }];
            }
            return this.parseChordProLine(line);
        });
    }

    private parseChordProLine(line: string): ChordSegment[] {
        const segments: ChordSegment[] = [];
        let currentChord = '';
        let currentText = '';
        let inChord = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '[') {
                if (currentText || currentChord) {
                    segments.push({ chord: currentChord, text: currentText });
                    currentChord = '';
                    currentText = '';
                }
                inChord = true;
            } else if (char === ']') {
                inChord = false;
            } else {
                if (inChord) {
                    currentChord += char;
                } else {
                    currentText += char;
                }
            }
        }

        if (currentText || currentChord) {
            segments.push({ chord: currentChord, text: currentText });
        }

        if (segments.length === 0) {
            segments.push({ chord: '', text: ' ' });
        }

        return segments;
    }

    hasChords(line: ChordSegment[]): boolean {
        return line.some(segment => !!segment.chord);
    }
}
