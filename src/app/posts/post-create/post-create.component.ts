import { OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";

import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Post } from "../post.model";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  private mode = 'create';
  private id: string;
  public post: Post;
  private isLoading: boolean;
  constructor(
    public postsService: PostsService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.id = paramMap.get("postId");
        this.isLoading = true;

        this.postsService.getPost(this.id).subscribe(postData => {
          this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, content: postData.content};
        });
      } else {
        this.mode = 'create';
        this.id = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      this.post.content = form.value.content;
      this.post.title = form.value.title;
      this.postsService.updatePost(this.post);
    }
    form.resetForm();
    // this.router.navigateByUrl('');
  }


}
