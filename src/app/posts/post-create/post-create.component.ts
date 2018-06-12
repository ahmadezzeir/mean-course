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
  constructor(
    public postsService: PostsService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.id = paramMap.get('id');
        this.post = this.postsService.getPost(this.id);
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
    if(this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      this.post.content = form.value.content;
      this.post.title = form.value.title;
      this.postsService.updatePost(this.post);
    }
    form.resetForm();
    this.router.navigateByUrl('');
  }
}
