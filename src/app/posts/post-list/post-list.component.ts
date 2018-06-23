import { AuthService } from './../../auth/auth.service';
import {  Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];
  // isUserAuthenticatedSubject = false;
  isUserAuthenticated = false;
  posts: Post[] = [];
  postsSubscription: Subscription;
  isUserAuthenticatedSubscription: Subscription;
  public isLoading: boolean;
  //paging
  pageSize = 2;
  total = 10;
  currentPage: number;
  pageSizeOptions = [1 ,2 ,5, 10, 20 ];
  ////
  constructor(
    private postsService: PostsService,
    private authService: AuthService,
    private router: Router) {}

  ngOnInit() {
    this.isLoading = true;
    this.currentPage = 1;
    this.postsService.getPosts(this.pageSize, this.currentPage);
    this.postsSubscription = this.postsService.getPostUpdateListener()
      .subscribe((data: {posts: Post[], total: number}) => {
        console.log(data);

        this.isLoading = false;
        this.posts = data.posts;
        this.total = data.total;
      });
      this.isUserAuthenticated = this.authService.getIsUserAuthenticated();
      this.isUserAuthenticatedSubscription = this.authService.getIsUserAuthenticatedSubject()
      .subscribe((isUserAuthenticated: boolean) => {
        this.isUserAuthenticated = isUserAuthenticated;
      })

  }

  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
    this.isUserAuthenticatedSubscription.unsubscribe();
  }

  onDelete(id) {
    //console.log('id', id);
    this.postsService.deletePost(id).subscribe(() => {
      this.postsService.getPosts(this.pageSize, this.currentPage);
    });
  }

  onChnage(pageEvent: PageEvent) {
    // console.log(pageEvent);
    this.isLoading = true;
    this.currentPage = pageEvent.pageIndex + 1;
    this.pageSize = pageEvent.pageSize;
    this.postsService.getPosts(this.pageSize, this.currentPage);
  }
  // onEdit(id) {
  //   console.log('id', id);
  //   this.router.navigate('edit',id);
  // }
}
