import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from 'rxjs/operators';
import { Post } from "./post.model";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsSubject = new Subject<Post[]>();
  constructor(private httpClient: HttpClient) {}

  getPosts() {
    this.httpClient
      .get<{ message: string; posts: any }>(
        "http://localhost:3000/api/posts"
      )
      .pipe(
        map((postData) => {
          return postData.posts.map(
            post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id
              }
            }
          );
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        //console.log(postData);
        this.postsSubject.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsSubject.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.httpClient.post<{message: string, newid: string}>("http://localhost:3000/api/posts",post)
    .subscribe(res => {
      console.log(res);
      post.id = res.newid;
      this.posts.push(post);
      console.log(post);
      this.postsSubject.next([...this.posts]);
    });

  }

  deletePost(id: string) {
    this.httpClient.delete('http://localhost:3000/api/posts/' + id)
      .subscribe(() => {
          console.log("deleted: ",id);
          const updatedList = this.posts.filter(post => post.id !== id) ;
          this.posts = updatedList;
          console.log(this.posts);
          this.postsSubject.next([...this.posts]);
      });
  }
}
