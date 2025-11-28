import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DragonballService, Character } from '../../services/dragonball.service';

@Component({
  selector: 'app-personajes-component',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './personajes-component.html',
  styleUrl: './personajes-component.css',
})
export class PersonajesComponent implements OnInit {
  personajes: Character[] = [];
  isLoading: boolean = true;

  constructor(
    private dragonballService: DragonballService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAllPersonajes();
  }

  loadAllPersonajes(): void {
    this.isLoading = true;
    console.log('Iniciando carga de personajes...');
    
    this.dragonballService.getAllCharacters().subscribe({
      next: (characters: Character[]) => {
        console.log('Personajes cargados:', characters.length);
        this.personajes = characters;
        this.isLoading = false;
        console.log('isLoading después de cargar:', this.isLoading);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar personajes:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
