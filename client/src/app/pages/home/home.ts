import { Component } from '@angular/core';
import { SharedModule } from '../../../shared.module';
import { ToolbarModule } from 'primeng/toolbar';
import { EditorModule } from 'primeng/editor';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = pdfFonts.vfs;

@Component({
  selector: 'app-home',
  imports: [SharedModule, ToolbarModule, EditorModule, DialogModule, ToastModule],
  providers: [MessageService],
  templateUrl: './home.html',
  styles: ``,
})
export class Home {
  visible = false;
  title = '';
  author = '';
  text = '';

  constructor(private messageService: MessageService) {}

  openDialog() {
    this.visible = true;
  }

  saveSong() {
    const song = { title: this.title, author: this.author, text: this.text };
    localStorage.setItem('song', JSON.stringify(song));
    this.visible = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Salvato',
      detail: 'La canzone è stata salvata!',
    });
  }

  loadSong() {
    const data = localStorage.getItem('song');
    if (data) {
      const song = JSON.parse(data);
      this.title = song.title;
      this.author = song.author;
      this.text = song.text;
    }
  }

  downloadPDF() {
    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      content: [
        {
          text: this.title || 'Titolo della canzone',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: this.author ? `Autore: ${this.author}` : '',
          fontSize: 12,
          italics: true,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        {
          text: this.stripHtml(this.text) || 'Testo della canzone...',
          fontSize: 12,
          alignment: 'left',
        },
      ],
    };
    pdfMake.createPdf(docDefinition as any).download(`${this.title || 'canzone'}.pdf`);
  }

  stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  ngOnInit() {
    this.loadSong();
  }
}
