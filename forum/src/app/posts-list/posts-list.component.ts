import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Post } from '../types/post';
import { LoaderComponent } from '../shared/loader/loader.component';
import { ElapsedTimePipe } from '../shared/pipes/elapsed-time.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [LoaderComponent, ElapsedTimePipe, RouterLink],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.css'
})
export class PostsListComponent implements OnInit {
  posts: Post[] = [];
  isLoading = true;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getPosts().subscribe(posts => {
      this.posts = posts;
      this.isLoading = false;
    });
  }
}
