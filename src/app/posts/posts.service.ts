import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private post: Post;
  private postsSubject = new Subject<Post[]>();
  constructor(private httpClient: HttpClient,
    private router: Router) {}

  getPost(id: string) {
    // return { ...this.posts.find(post => post.id === id) };
    return this.httpClient
    .get<{ _id: string; title: string; content: string }>('http://localhost:3000/api/posts/' + id);
    // .subscribe(res => {
    //   this.post = res.post;
    //   // console.log(postData);
    //   this.postsSubject.next([...this.posts]);
    // });
  }
  getPosts() {
    this.httpClient
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        // console.log(postData);
        this.postsSubject.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsSubject.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.httpClient
      .post<{ message: string; newid: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe(res => {
        console.log(res);
        post.id = res.newid;
        this.posts.push(post);
        console.log(post);
        this.postsSubject.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    this.httpClient
      .delete('http://localhost:3000/api/posts/' + id)
      .subscribe(() => {
        console.log('deleted: ', id);
        const updatedList = this.posts.filter(post => post.id !== id);
        this.posts = updatedList;
        console.log(this.posts);
        this.postsSubject.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(post: Post) {
    this.httpClient
      .put('http://localhost:3000/api/posts/' + post.id, post)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsSubject.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }
}
