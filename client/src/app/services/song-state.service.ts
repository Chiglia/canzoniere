import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

export interface Song {
    id: string;
    title: string;
    artist: string;
    category: string;
    content: string;
}

@Injectable({
    providedIn: 'root'
})
export class SongStateService {
    private translocoService = inject(TranslocoService);

    public songs: Song[] = [];
    public searchQuery = '';
    public activeSongId: string | null = null;
    public activeTab: 'edit' | 'preview' = 'edit';
    public notation: 'it' | 'intl' = 'it';

    public editForm = {
        id: '',
        title: '',
        artist: '',
        category: '',
        content: ''
    };
    public isNewSong = true;

    loadSongsFromStorage() {
        try {
            const saved = localStorage.getItem('canzoniere-songs');
            if (saved) {
                this.songs = JSON.parse(saved);
            }
            const savedNotation = localStorage.getItem('canzoniere-notation');
            if (savedNotation === 'it' || savedNotation === 'intl') {
                this.notation = savedNotation;
            }
        } catch (e) {
            console.error('Failed to load songs from storage', e);
        }
    }

    saveSongsToStorage() {
        localStorage.setItem('canzoniere-songs', JSON.stringify(this.songs));
        localStorage.setItem('canzoniere-notation', this.notation);
    }

    loadClassicSongs() {
        this.songs = [
            {
                id: '1',
                title: 'La canzone del sole',
                artist: 'Lucio Battisti',
                category: 'Classico Italiano',
                content: `[La]Le bionde trecce, gli [Mi]occhi azzurri e poi
[Re]Le tue calze rosse [La]e l'innocenza sulle gote tue
[La]Due lune d'un colpo non [Mi]esistono più
[Re]È d'un tratto quel sorriso [La]fuggito dal volto tuo

[La]Ma come fa un [Mi]fiore a nascere
[Re]In mezzo al fango, [La]come me?
[La]E se c'è un [Mi]posto per me
[Re]In mezzo al cielo, [La]come te?

[La]Le bionde trecce, gli [Mi]occhi azzurri e poi
[Re]Le tue calze rosse [La]e l'innocenza sulle gote tue`
            },
            {
                id: '2',
                title: 'Nel blu dipinto di blu',
                artist: 'Domenico Modugno',
                category: 'Cantautore',
                content: `[Nel] blu dipinto di [Sol]blu, [La]felice di stare las[Re]sù
[Re]Penso che un sogno co[Mim]sì non ritorni mai [La7]più
Mi di[Re]pingevo le mani e la [Mim]faccia di blu
Poi d'im[La7]provviso venivo dal vento ra[Re]pito
E co[Mim]minciavo a vo[La7]lare nel cielo infi[Re]nito

Vola[Mim]re, oh [La7]oh! Canta[Re]re, oh oh [Si7]oh!
Nel [Mim]blu di[La7]pinto di [Re]blu, [Si7]felice di [Mim]stare las[La7]sù!`
            },
            {
                id: '3',
                title: 'Albachiara',
                artist: 'Vasco Rossi',
                category: 'Rock Italiano',
                content: `[Do]Respiri piano per non [Sol]far rumore
Ti ad[Lam]dormenti di sera e ti [Mim]svegli col sole
Sei [Fa]chiara come un'alba, sei [Do]fresca come l'aria
Diventi [Rem]rossa se qualcuno ti [Sol]guarda

[Do]Sei fantastica, [Sol]sei unica,
Ti ad[Lam]dormenti di sera e ti [Mim]svegli col sole
[Fa]Sei chiara come un'alba, [Do]sei fresca come l'aria
[Rem]Diventi rossa se qualcuno ti [Sol]guarda`
            }
        ];
        this.saveSongsToStorage();
        this.selectSong(this.songs[0].id);
    }

    resetToSamples() {
        if (confirm(this.translocoService.translate('app.delete_confirm'))) {
            this.loadClassicSongs();
        }
    }

    selectSong(id: string) {
        this.activeSongId = id;
        const song = this.songs.find(s => s.id === id);
        if (song) {
            this.loadSongForEditing(song);
        }
    }

    createNewSong() {
        this.isNewSong = true;
        this.activeSongId = null;
        this.editForm = {
            id: Math.random().toString(36).substring(2, 9),
            title: '',
            artist: '',
            category: '',
            content: ''
        };
        this.activeTab = 'edit';
    }

    loadSongForEditing(song: Song) {
        this.isNewSong = false;
        this.editForm = {
            id: song.id,
            title: song.title,
            artist: song.artist,
            category: song.category,
            content: song.content
        };
    }

    saveSong() {
        if (!this.editForm.title.trim()) {
            alert('Il titolo è obbligatorio!');
            return;
        }

        const songData: Song = {
            id: this.editForm.id,
            title: this.editForm.title.trim(),
            artist: this.editForm.artist.trim() || 'Sconosciuto',
            category: this.editForm.category.trim() || 'Generico',
            content: this.editForm.content
        };

        if (this.isNewSong) {
            this.songs.push(songData);
            this.isNewSong = false;
        } else {
            const idx = this.songs.findIndex(s => s.id === songData.id);
            if (idx !== -1) {
                this.songs[idx] = songData;
            }
        }

        this.activeSongId = songData.id;
        this.saveSongsToStorage();
    }

    deleteSong(id: string) {
        if (confirm(this.translocoService.translate('app.delete_confirm'))) {
            this.songs = this.songs.filter(s => s.id !== id);
            this.saveSongsToStorage();

            if (this.activeSongId === id) {
                if (this.songs.length > 0) {
                    this.selectSong(this.songs[0].id);
                } else {
                    this.createNewSong();
                }
            }
        }
    }

    moveSongUp(idx: number, event: Event) {
        event.stopPropagation();
        if (idx === 0) return;
        const temp = this.songs[idx];
        this.songs[idx] = this.songs[idx - 1];
        this.songs[idx - 1] = temp;
        this.saveSongsToStorage();
    }

    moveSongDown(idx: number, event: Event) {
        event.stopPropagation();
        if (idx === this.songs.length - 1) return;
        const temp = this.songs[idx];
        this.songs[idx] = this.songs[idx + 1];
        this.songs[idx + 1] = temp;
        this.saveSongsToStorage();
    }

    get filteredSongs(): Song[] {
        const query = this.searchQuery.toLowerCase().trim();
        if (!query) return this.songs;
        return this.songs.filter(s =>
            s.title.toLowerCase().includes(query) ||
            s.artist.toLowerCase().includes(query) ||
            s.content.toLowerCase().includes(query) ||
            s.category.toLowerCase().includes(query)
        );
    }
}
