import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { LanguageService } from '../../services/language-service';
import { SongbookService } from '../../services/songbook.service';
import { SongSidebar } from './components/song-sidebar/song-sidebar';
import { SongEditor } from './components/song-editor/song-editor';
import { SongPreview } from './components/song-preview/song-preview';
import { BookletPreview } from './components/booklet-preview/booklet-preview';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    FormsModule,
    TranslocoModule,
    SongSidebar,
    SongEditor,
    SongPreview,
    BookletPreview
  ],
  templateUrl: './home.html',
  styles: `
    /* Print styles */
    @media print {
      html, body, #app-root-container, main {
        height: auto !important;
        min-height: auto !important;
        overflow: visible !important;
        display: block !important;
        background: white !important;
        color: black !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .no-print {
        display: none !important;
      }
      #print-booklet-container {
        display: block !important;
        margin: 0 !important;
        padding: 0 !important;
        max-width: none !important;
        width: 100% !important;
      }
      .print-page {
        page-break-after: always;
        break-after: page;
        width: 148mm !important;
        height: 210mm !important;
        padding: 15mm !important;
        margin: 0 auto !important;
        box-shadow: none !important;
        border: none !important;
        border-radius: 0 !important;
        box-sizing: border-box !important;
        page-break-inside: avoid;
        break-inside: avoid;
        background: white !important;
        color: black !important;
      }
      .print-page-continuous {
        width: 148mm !important;
        height: auto !important;
        min-height: 210mm !important;
        padding: 15mm !important;
        margin: 0 auto !important;
        box-shadow: none !important;
        border: none !important;
        border-radius: 0 !important;
        box-sizing: border-box !important;
        background: white !important;
        color: black !important;
        page-break-after: always;
        break-after: page;
      }
    }
    .print-page-continuous {
      width: 100%;
      max-width: 148mm;
      min-height: 210mm;
      height: auto;
      box-sizing: border-box;
    }
  `
})
export class Home implements OnInit {
  public langService = inject(LanguageService);
  public service = inject(SongbookService);

  ngOnInit() {
    this.service.init();
  }
}
