import { Component, OnInit } from '@angular/core';
import { FileResponse, FilesApiService } from "../../services/files/files.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-download-file',
  template: '<p>&nbsp;</p>',
})
export class DownloadFileComponent implements OnInit {
  constructor(private fileApi: FilesApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const guid = this.route.snapshot.paramMap.get('guid')!

    if (!this.checkIfGuidIsValid(guid)) {
      console.error("Uzyty identyfikator nie jest poprawnym identyfikatorem GUID");
      return;
    }

    this.sendDownloadRequest(guid);
  }

  private sendDownloadRequest(guid: string): void {
    this.fileApi.downloadFile(guid).subscribe({
      next: response => this.downloadFile(response.result),
      error: error => console.error(error)
    });
  }

  private downloadFile(file: FileResponse) {
    const dummyLink = document.createElement('a');
    document.body.appendChild(dummyLink);

    const blob = new Blob([file.data], {type: file.headers!['content-type']});
    const url = window.URL.createObjectURL(blob);

    dummyLink.href = url;
    dummyLink.download = file.fileName!;
    dummyLink.click();

    window.URL.revokeObjectURL(url);
    window.close();
  }

  private checkIfGuidIsValid(guid: string) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return regex.test(guid);
  }
}
