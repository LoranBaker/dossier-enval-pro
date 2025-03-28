import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DossierComponent } from "./features/dossier/dossier/dossier.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DossierComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'dossier-enval-pro';
}
