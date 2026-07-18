import { Component, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { SongbookService } from '../../../../services/songbook.service';
import { SharedModule } from '../../../../../shared.module';

@Component({
  selector: 'app-song-sidebar',
  imports: [SharedModule, TranslocoModule],
  templateUrl: './song-sidebar.html',
  styles: ``
})
export class SongSidebar {
  public service = inject(SongbookService);
}
