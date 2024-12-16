import { Component, OnInit } from '@angular/core';
import { BookmarkService } from '../services/bookmark.service';

@Component({
  selector: 'app-bookmark',
  standalone: false,
  
  templateUrl: './bookmark.component.html',
  styleUrl: './bookmark.component.css'
})
export class BookmarkComponent implements OnInit {
  
  bookmarks: any[] = [];
  constructor(private bookmarkService: BookmarkService) {}

  ngOnInit(): void {
    this.bookmarks = this.bookmarkService.getBookmarks();
  }
  // Remove card from bookmarks
  removeBookmark(card: { RemedyId:number,RemedyName:string,Remediesimg:File,Description:string,Benefits:string,PreperationMethod:string,UsageInstructions:string,CategoryId:number }): void {
    this.bookmarkService.removeBookmark(card);
    this.bookmarks = this.bookmarkService.getBookmarks();  // Re-fetch the bookmarks after removal
  }
}

