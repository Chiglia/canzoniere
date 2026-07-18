import { Injectable } from '@angular/core';

export interface BookletSettings {
    title: string;
    subtitle: string;
    author: string;
    coverStyle: 'classic' | 'modern' | 'vintage';
    fontSize: 'sm' | 'md' | 'lg';
    columns: '1' | '2';
    layoutMode: 'one-per-page' | 'continuous';
}

@Injectable({
    providedIn: 'root'
})
export class BookletService {
    public viewMode: 'editor' | 'booklet' = 'editor';
    public fontSizes: ('sm' | 'md' | 'lg')[] = ['sm', 'md', 'lg'];

    public globalNotation: 'it' | 'intl' = 'it';
    public globalTranspose = 0;

    public bookSettings: BookletSettings = {
        title: 'Il mio Canzoniere',
        subtitle: 'Accordi e canti attorno al fuoco',
        author: 'A cura di Davide',
        coverStyle: 'vintage',
        fontSize: 'md',
        columns: '2',
        layoutMode: 'continuous'
    };

    loadSettingsFromStorage(defaultNotation: 'it' | 'intl') {
        try {
            const savedSettings = localStorage.getItem('canzoniere-settings');
            if (savedSettings) {
                this.bookSettings = { ...this.bookSettings, ...JSON.parse(savedSettings) };
            }
            const savedNotation = localStorage.getItem('canzoniere-notation');
            if (savedNotation === 'it' || savedNotation === 'intl') {
                this.globalNotation = savedNotation;
            } else {
                this.globalNotation = defaultNotation;
            }
        } catch (e) {
            console.error('Failed to load booklet settings', e);
        }
    }

    saveSettingsToStorage(notation: 'it' | 'intl') {
        localStorage.setItem('canzoniere-settings', JSON.stringify(this.bookSettings));
        localStorage.setItem('canzoniere-notation', notation);
    }

    adjustGlobalTranspose(val: number) {
        this.globalTranspose += val;
    }

    resetGlobalTranspose() {
        this.globalTranspose = 0;
    }

    toggleGlobalNotation() {
        this.globalNotation = this.globalNotation === 'it' ? 'intl' : 'it';
    }

    generateBooklet() {
        this.viewMode = 'booklet';
    }

    printBooklet() {
        window.print();
    }
}
