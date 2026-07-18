import { Injectable, inject } from '@angular/core';
import { ChordService, ChordSegment } from './chord.service';
import { SongStateService, Song } from './song-state.service';
import { BookletService, BookletSettings } from './booklet.service';
import { ImportExportService } from './import-export.service';
import { LanguageService } from './language-service';

export type { Song, BookletSettings, ChordSegment };

@Injectable({
  providedIn: 'root'
})
export class SongbookService {
  public chordService = inject(ChordService);
  public songState = inject(SongStateService);
  public bookletService = inject(BookletService);
  public importExport = inject(ImportExportService);
  public langService = inject(LanguageService);

  // Facade properties for seamless template and component support
  get songs() { return this.songState.songs; }
  set songs(val: Song[]) { this.songState.songs = val; }

  get searchQuery() { return this.songState.searchQuery; }
  set searchQuery(val: string) { this.songState.searchQuery = val; }

  get activeSongId() { return this.songState.activeSongId; }
  set activeSongId(val: string | null) { this.songState.activeSongId = val; }

  get activeTab() { return this.songState.activeTab; }
  set activeTab(val: 'edit' | 'preview') { this.songState.activeTab = val; }

  get viewMode() { return this.bookletService.viewMode; }
  set viewMode(val: 'editor' | 'booklet') { this.bookletService.viewMode = val; }

  get fontSizes() { return this.bookletService.fontSizes; }

  get notation() { return this.songState.notation; }
  set notation(val: 'it' | 'intl') { this.songState.notation = val; }

  get globalNotation() { return this.bookletService.globalNotation; }
  set globalNotation(val: 'it' | 'intl') { this.bookletService.globalNotation = val; }

  get globalTranspose() { return this.bookletService.globalTranspose; }
  set globalTranspose(val: number) { this.bookletService.globalTranspose = val; }

  get editForm() { return this.songState.editForm; }
  set editForm(val) { this.songState.editForm = val; }

  get isNewSong() { return this.songState.isNewSong; }
  set isNewSong(val: boolean) { this.songState.isNewSong = val; }

  get bookSettings() { return this.bookletService.bookSettings; }
  set bookSettings(val: BookletSettings) { this.bookletService.bookSettings = val; }

  // Chord mappings proxies
  get itChords() { return this.chordService.itChords; }
  get intlChords() { return this.chordService.intlChords; }
  get currentChordQuickList() {
    return this.notation === 'it' ? this.itChords : this.intlChords;
  }

  init() {
    this.songState.loadSongsFromStorage();
    this.bookletService.loadSettingsFromStorage(this.songState.notation);
    if (this.songs.length === 0) {
      this.songState.loadClassicSongs();
    } else {
      this.selectSong(this.songs[0].id);
    }
  }

  resetToSamples() {
    this.songState.resetToSamples();
  }

  selectSong(id: string) {
    this.songState.selectSong(id);
  }

  createNewSong() {
    this.songState.createNewSong();
  }

  loadSongForEditing(song: Song) {
    this.songState.loadSongForEditing(song);
  }

  saveSong() {
    this.songState.saveSong();
    this.bookletService.saveSettingsToStorage(this.notation);
  }

  deleteSong(id: string) {
    this.songState.deleteSong(id);
  }

  moveSongUp(idx: number, event: Event) {
    this.songState.moveSongUp(idx, event);
  }

  moveSongDown(idx: number, event: Event) {
    this.songState.moveSongDown(idx, event);
  }

  quickInsertChord(chordName: string, textarea: HTMLTextAreaElement | null) {
    if (!textarea) {
      this.editForm.content += `[${chordName}]`;
      return;
    }

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const text = this.editForm.content;

    this.editForm.content = text.substring(0, startPos) + `[${chordName}]` + text.substring(endPos);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = startPos + chordName.length + 2;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }

  transposeText(semitones: number) {
    this.editForm.content = this.chordService.transposeContent(this.editForm.content, semitones, this.notation);
  }

  toggleNotation() {
    const nextNotation = this.notation === 'it' ? 'intl' : 'it';
    this.editForm.content = this.chordService.transposeContent(this.editForm.content, 0, nextNotation);
    this.notation = nextNotation;
    this.songState.saveSongsToStorage();
    this.bookletService.saveSettingsToStorage(this.notation);
  }

  toggleGlobalNotation() {
    this.bookletService.toggleGlobalNotation();
  }

  adjustGlobalTranspose(val: number) {
    this.bookletService.adjustGlobalTranspose(val);
  }

  resetGlobalTranspose() {
    this.bookletService.resetGlobalTranspose();
  }

  getParsedLines(content: string, transposeOffset: number = 0, targetNotation: 'it' | 'intl' = this.notation) {
    return this.chordService.getParsedLines(content, transposeOffset, targetNotation, this.notation);
  }

  hasChords(line: ChordSegment[]): boolean {
    return this.chordService.hasChords(line);
  }

  get filteredSongs(): Song[] {
    return this.songState.filteredSongs;
  }

  exportSongbook() {
    this.importExport.exportSongbook(this.bookSettings, this.songs);
  }

  triggerImportClick() {
    this.importExport.triggerImportClick();
  }

  importSongbook(event: any) {
    this.importExport.importSongbook(event, (songs, settings) => {
      this.songs = songs;
      if (settings) {
        this.bookSettings = { ...this.bookSettings, ...settings };
      }
      this.songState.saveSongsToStorage();
      this.bookletService.saveSettingsToStorage(this.notation);
      if (this.songs.length > 0) {
        this.selectSong(this.songs[0].id);
      }
    });
  }

  printBooklet() {
    this.bookletService.printBooklet();
  }

  generateBooklet() {
    this.bookletService.generateBooklet();
  }
}
