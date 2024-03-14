import { Component } from '@angular/core';
import { Card } from '../services-models/card.model';
import { CardService } from '../services-models/card.service';
import { Router } from '@angular/router';
import { DataMediatorService } from '../services-models/data-mediator.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-content-display',
  templateUrl: './content-display.component.html',
  styleUrls: ['./content-display.component.css']
})
export class ContentDisplayComponent {
  cards: any = [];
  displayedCards: any = [];
  searchText = '';
  selectedCategory = '';
  sortOptions = [
    { value: 'asc', label: 'Oldest' },
    { value: 'desc', label: 'Newest' }
  ];
  selectedSort = 'desc';

  constructor(private cardService: CardService,
    private router: Router,
    private dataService: DataMediatorService,
    private http: HttpClient,) {}

  ngOnInit(): void {
      this.http.get('http://127.0.0.1:5000/content-list').subscribe(
      (response) => {
        this.cards = response;
        this.loadDisplayedCards();
      },
      (error) => {
        console.error(error); // Handle any errors
        alert(error!.error!.message)
      }
    );
  }

  onScroll(): void {
    this.loadDisplayedCards();
  }

  private loadDisplayedCards(): void {
    const startIndex = this.displayedCards.length;
    const endIndex = startIndex + 5;
    this.displayedCards = this.cards.slice(startIndex, endIndex);
    this.displayedCards = this.displayedCards.sort((a: { id: number; title: string; category: string; date: Date; content: String}, b: { title: string; category: string; date: Date; content: String}) =>
      {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        const result = dateA.getTime() - dateB.getTime();
        return this.selectedSort === 'desc' ? -result : result;
      });
  }

  applyFiltersAndSort(): void {
    if (this.selectedCategory === '' || this.searchText === ''){
      this.displayedCards = this.cards
    }

    this.displayedCards = this.cards
      .filter((card: { id: number; title: string; category: string; date: Date; content: String}) =>
        card.title.toLowerCase().includes(this.searchText.toLowerCase()) &&
        (this.selectedCategory === '' || card.category === this.selectedCategory)
      )
      .sort((a: { id: number; title: string; category: string; date: Date; content: String}, b: { title: string; category: string; date: Date; content: String}) =>
        {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          const result = dateA.getTime() - dateB.getTime();
          return this.selectedSort === 'desc' ? -result : result;
        });
  }

  openBlog(card: Card): void {
    this.http.post('http://127.0.0.1:5000/view-count', {id: card.id}).subscribe(
      (response: any) => {
        console.log(response)
        if (response.id === card.id){
          this.dataService.setData(card);
          this.router.navigate(['/blog']);
        }
      },
      (error) => {
        console.error(error); // Handle any errors
        alert(error!.error!.message)
      }
    );
  }
}
