import { Injectable } from '@angular/core';
import { Song } from './song-state.service';
import { BookletSettings } from './booklet.service';

@Injectable({
    providedIn: 'root'
})
export class ImportExportService {
    exportSongbook(bookSettings: BookletSettings, songs: Song[]) {
        const payload = {
            version: '1.0',
            bookSettings: bookSettings,
            songs: songs
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `${bookSettings.title.replace(/\s+/g, '_')}_canzoniere.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    }

    triggerImportClick() {
        const fileInput = document.getElementById('json-import-file');
        if (fileInput) {
            fileInput.click();
        }
    }

    importSongbook(event: any, onImportSuccess: (songs: Song[], settings?: BookletSettings) => void) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e: any) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data && Array.isArray(data.songs)) {
                    onImportSuccess(data.songs, data.bookSettings);
                    alert('Canzoniere importato con successo!');
                } else if (Array.isArray(data)) {
                    onImportSuccess(data);
                    alert('Canzoniere importato con successo!');
                } else {
                    alert('Formato JSON non valido.');
                }
            } catch (err) {
                alert('Errore nel parsing del file JSON.');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }
}
