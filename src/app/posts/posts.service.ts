import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Post } from './post.model';
import { environment } from "../../environments/environment";

const serviceURL = environment.apiURL + 'api/posts';

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private post: Post;
  private postsSubject = new Subject<{ posts: Post[]; total: number }>();
  constructor(private httpClient: HttpClient, private router: Router) {}

  getPost(id: string) {
    // return { ...this.posts.find(post => post.id === id) };
    return this.httpClient.get<{ _id: string; title: string; content: string }>(
      serviceURL + "/" + id
    );
    // .subscribe(res => {
    //   this.post = res.post;
    //   // console.log(postData);
    //   this.postsSubject.next([...this.posts]);
    // });
  }
  getPosts(pageSize: number, currentPage: number) {
    const query = `?pageSize=${pageSize}&currentPage=${currentPage}`;
    this.httpClient
      .get<{ message: string; posts: any; count: number }>(
        serviceURL + query
      )
      .pipe(
        map(postData => {
          // console.log('postData',postData);

          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                createdBy: post.createdBy,
              };
            }),
            total: postData.count
          };
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts.posts;
        if(transformedPosts.posts.length == 0 && currentPage > 0) {
          currentPage = currentPage - 1;
          this.getPosts(pageSize, currentPage);









        }
        // console.log(postData);
        this.postsSubject.next({
          posts: [...this.posts],
          total: transformedPosts.total
        });
      });
  }

  getPostUpdateListener() {
    return this.postsSubject.asObservable();
  }

  addPost(title: string, content: string, image: File, image2: File) {
    const postFormData = new FormData();
    postFormData.append("title", title);
    postFormData.append("content", content);
    postFormData.append("image", image, title);
    postFormData.append("image1", image2, title);

    // const post: Post = { id: null, title: title, content: content };
    this.httpClient
      .post<{ message: string; post: Post }>(
        serviceURL,
        //post
        postFormData
      )
      .subscribe(res => {
        // console.log(res);
        const post: Post = {
          id: res.post.id,
          title: res.post.title, //title parameter
          content: res.post.content, // content parameter
          imagePath: res.post.imagePath,
          //files: res.post.files
        };
        //post.id = res.newid;
        this.posts.push(post);
        // console.log(post);
        //this.postsSubject.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  deletePost(id: string) {
    return this.httpClient
      .delete(serviceURL + "/" + id)
      // .subscribe(() => {
      //   //console.log('deleted: ', id);
      //   // const updatedList = this.posts.filter(post => post.id !== id);
      //   // this.posts = updatedList;
      //   // //console.log(this.posts);
      //   // this.postsSubject.next([...this.posts]);
      //   this.router.navigate(["/"]);
      // });
  }

  updatePost(post: Post) {
    //console.log('service: ',post);
    const postFormData = new FormData();
    if (typeof post.imagePath === "string") {
      postFormData.append("title", post.title);
      postFormData.append("content", post.content);
      postFormData.append("imagePath", post.imagePath);
    } else {
      postFormData.append("title", post.title);
      postFormData.append("content", post.content);
      postFormData.append("image", post.imagePath, post.title);
    }
    this.httpClient
      //.put('http://localhost:3000/api/posts/' + post.id, post)
      .put(serviceURL + "/" + post.id, postFormData)
      .subscribe(response => {
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);

        // updatedPosts[oldPostIndex] = post;
        // this.posts = updatedPosts;
        // this.postsSubject.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }
}
