import { Component, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { SongbookService } from '../../../../services/songbook.service';
import { SharedModule } from '../../../../../shared.module';

@Component({
  selector: 'app-booklet-preview',
  imports: [SharedModule, TranslocoModule],
  templateUrl: './booklet-preview.html',
  styles: ``
})
export class BookletPreview {
  public service = inject(SongbookService);
}
