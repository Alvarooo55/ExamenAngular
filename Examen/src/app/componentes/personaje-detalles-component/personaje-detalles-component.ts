import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DragonballService, Character, Transformation } from '../../services/dragonball.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-personaje-detalles-component',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './personaje-detalles-component.html',
  styleUrl: './personaje-detalles-component.css',
})
export class PersonajeDetallesComponent implements OnInit, OnDestroy {
  personaje: Character | null = null;
  isLoading: boolean = true;
  selectedTransformacion: number | null = null;
  private subscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dragonballService: DragonballService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('ID recibido:', id);
      if (id) {
        this.personaje = null;
        this.isLoading = true;
        this.loadPersonaje(+id);
      } else {
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadPersonaje(id: number): void {
    console.log('Cargando personaje con ID:', id);
    this.isLoading = true;
    this.dragonballService.getCharacterById(id).subscribe({
      next: (character: Character) => {
        console.log('Personaje cargado:', character);
        this.personaje = character;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar personaje:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onTransformacionClick(transformacion: Transformation): void {
    console.log('Click en transformación:', transformacion.name);
    this.isLoading = true;
    
    // Buscar el personaje que coincida exactamente con el nombre de la transformación
    this.dragonballService.getAllCharacters().subscribe({
      next: (characters: Character[]) => {
        // Buscar un personaje cuyo nombre coincida EXACTAMENTE con la transformación
        const personajeEncontrado = characters.find(c => 
          c.name.toLowerCase().trim() === transformacion.name.toLowerCase().trim()
        );
        
        if (personajeEncontrado) {
          console.log('Personaje encontrado para la transformación:', personajeEncontrado.name);
          this.router.navigate(['/personajes', personajeEncontrado.id]);
        } else {
          console.log('Esta transformación no existe como personaje independiente:', transformacion.name);
          this.isLoading = false;
          this.cdr.detectChanges();
          // Mostrar un mensaje visual de que no es navegable
          alert(`${transformacion.name} no está disponible como personaje individual`);
        }
      },
      error: (error) => {
        console.error('Error al buscar personaje:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private highlightTransformacion(id: number): void {
    this.selectedTransformacion = id;
    setTimeout(() => {
      const element = document.getElementById(`transformacion-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }
}
