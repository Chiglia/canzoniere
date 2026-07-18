import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { SongbookService } from '../../../../services/songbook.service';
import { SharedModule } from '../../../../../shared.module';

@Component({
  selector: 'app-song-editor',
  imports: [SharedModule, TranslocoModule],
  templateUrl: './song-editor.html',
  styles: ``
})
export class SongEditor {
  public service = inject(SongbookService);

  @ViewChild('lyricsTextarea') lyricsTextarea!: ElementRef<HTMLTextAreaElement>;

  insertChord(chord: string) {
    const textarea = this.lyricsTextarea ? this.lyricsTextarea.nativeElement : null;
    this.service.quickInsertChord(chord, textarea);
  }

  save() {
    this.service.saveSong();
    this.service.activeTab = 'preview';
  }
}
