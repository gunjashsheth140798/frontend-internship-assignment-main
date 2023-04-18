import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { faHouse, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, filter } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'front-end-internship-assignment-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  bookSearch: FormControl;

  faHouse = faHouse;
  glass = faMagnifyingGlass;
  public isActive: any = true;
  search = '';
  url = '/search.json?q=';
  searchData: any[] = [];
  page = 1;
  pageSize = 10;
  pageSizes = [10, 50, 100, 200, 300, 400];
  size: any;
  closeResult = '';
  data = '';

  constructor(private apiService: ApiService, private modalService: NgbModal) {
    this.bookSearch = new FormControl('');
  }

  trendingSubjects: Array<any> = [
    { name: 'JavaScript' },
    { name: 'CSS' },
    { name: 'HTML' },
    { name: 'Harry Potter' },
    { name: 'Crypto' },
  ];

  ngOnInit(): void {
    this.bookSearch.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value: string) => {});
  }

  getSearchData() {
    if (this.search != null) {
      if (this.search.length >= 3 || this.search.length === 0) {
        this.apiService
          .get(
            this.url +
              this.search +
              '&limit=' +
              this.pageSize +
              '&page=' +
              this.page
          )
          .subscribe((data: any) => {
            this.searchData = data.docs;
            this.size = data.numFound;
          });
      }
    }
  }

  handlePageSizeChange(): void {
    this.page = 1;
    this.getSearchData();
  }

  convert(data: any) {
    return Array.of(data);
  }

  open(content: any, years: any) {
    this.data = years;
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
