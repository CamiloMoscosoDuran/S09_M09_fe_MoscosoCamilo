import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Game, GamesService } from '../../services/games.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-enrollments',
  standalone: false,
  styleUrl: './enrollments.component.css',
  templateUrl: './enrollments.component.html'
})
export class EnrollmentsComponent implements OnInit {
  @ViewChild('gameForm') gameForm!: NgForm;

  games: Game[] = [];
  game: Game = { title: '', genre: '', releaseDate: '', price: 0, image: '', rating: 0 };
  editMode = false;
  submitSuccess = false;
  submitError = false;
  errorMessage = '';

  constructor(private service: GamesService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getAll().subscribe(
      data => {
        this.games = data;
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error al cargar los juegos:', error);
        this.submitError = true;
        this.errorMessage = 'Error al cargar los videojuegos';
      }
    );
  }

  save(form: NgForm) {
    if (!form.valid) {
      this.submitError = true;
      this.errorMessage = 'Por favor completa todos los campos correctamente';
      return;
    }

    if (this.editMode) {
      this.service.update(this.game.id!, this.game)
        .subscribe(
          () => {
            this.submitSuccess = true;
            this.load();
            this.resetForm();
            setTimeout(() => this.submitSuccess = false, 3000);
          },
          error => {
            console.error('Error al actualizar:', error);
            this.submitError = true;
            this.errorMessage = 'Error al actualizar el videojuego';
          }
        );
      this.editMode = false;
    } else {
      this.service.create(this.game)
        .subscribe(
          () => {
            this.submitSuccess = true;
            this.load();
            this.resetForm();
            setTimeout(() => this.submitSuccess = false, 3000);
          },
          error => {
            console.error('Error al crear:', error);
            this.submitError = true;
            this.errorMessage = 'Error al crear el videojuego';
          }
        );
    }
  }

  edit(g: Game) {
    this.game = { ...g };
    this.editMode = true;
    this.submitError = false;
    this.submitSuccess = false;
  }

  delete(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este videojuego?')) {
      this.service.delete(id)
        .subscribe(
          () => {
            this.submitSuccess = true;
            this.load();
            setTimeout(() => this.submitSuccess = false, 3000);
          },
          error => {
            console.error('Error al eliminar:', error);
            this.submitError = true;
            this.errorMessage = 'Error al eliminar el videojuego';
          }
        );
    }
  }

  resetForm() {
    this.game = { title: '', genre: '', releaseDate: '', price: 0, image: '', rating: 0 };
    this.editMode = false;
    this.submitError = false;
    if (this.gameForm) {
      this.gameForm.resetForm();
    }
  }

  cancelEdit() {
    this.resetForm();
  }
}
