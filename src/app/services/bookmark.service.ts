import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {

  private bookmarkKey = 'bookmarkedCards';
  constructor() { }
   // Get all bookmarked cards from local storage
   getBookmarks(): any[] {
    const bookmarks = localStorage.getItem(this.bookmarkKey);
    return bookmarks ? JSON.parse(bookmarks) : [];
  }

  // Add a new card to the bookmarks
  addBookmark(card: { RemedyId:number,RemedyName:string,Remediesimg:File,Description:string,Benefits:string,PreperationMethod:string,UsageInstructions:string,CategoryId:number }): void {
    const bookmarks = this.getBookmarks();
    bookmarks.push(card);
    localStorage.setItem(this.bookmarkKey, JSON.stringify(bookmarks));
  }
  removeBookmark(card: { RemedyId:number,RemedyName:string,Remediesimg:File,Description:string,Benefits:string,PreperationMethod:string,UsageInstructions:string,CategoryId:number }): void {
    let bookmarks = this.getBookmarks();
    bookmarks = bookmarks.filter(b => b.image !== card.Remediesimg || b.title !== card.RemedyName);  // Assuming uniqueness based on image and title
    localStorage.setItem(this.bookmarkKey, JSON.stringify(bookmarks));
  }
}
