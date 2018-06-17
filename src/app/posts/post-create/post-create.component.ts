import { OnInit,Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Post } from "../post.model";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  private mode = "create";
  private id: string;
  public post: Post;
  isLoading: boolean;
  form: FormGroup;

  constructor(
    public postsService: PostsService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] })
    });

    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      //console.log(paramMap.has("id"));

      if (paramMap.has("id")) {
        this.mode = "edit";
        this.id = paramMap.get("id");
        this.isLoading = true;
        //console.log(this.id);
        this.postsService.getPost(this.id).subscribe((postData: any) => {
          console.log(postData);
          this.isLoading = false;


          this.post = {
            id: postData.post._id,
            title: postData.post.title,
            content: postData.post.content
          };
          console.log(this.post);

          this.form.setValue({
            title: this.post.title,
            content: this.post.content
          })
        });
      } else {
        this.mode = "create";
        this.id = null;
      }
    });
  }

  onSavePost() {
    // console.log('***************');
    // console.log(this.form);
    // console.log('***************');
    if (this.form.invalid) {
      return;

    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content
      );
    } else {
      console.log(this.form.value.content);

      this.post.content = this.form.value.content;
      this.post.title = this.form.value.title;
      this.postsService.updatePost(this.post);
    }
    this.form.reset();
    // this.router.navigateByUrl('');
  }
}
