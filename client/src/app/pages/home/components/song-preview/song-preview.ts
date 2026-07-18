import { Component, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { SongbookService } from '../../../../services/songbook.service';
import { SharedModule } from '../../../../../shared.module';

@Component({
  selector: 'app-song-preview',
  imports: [SharedModule, TranslocoModule],
  templateUrl: './song-preview.html',
  styles: ``
})
export class SongPreview {
  public service = inject(SongbookService);

  get songPageIndex(): number {
    if (!this.service.activeSongId) return 2;
    const idx = this.service.songs.findIndex(s => s.id === this.service.activeSongId);
    return idx !== -1 ? idx + 2 : 2;
  }
}
