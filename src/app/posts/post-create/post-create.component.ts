import { HttpClient } from '@angular/common/http';
import { Post } from './../post.model';
import { OnInit, Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";

import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit, OnDestroy {

  enteredTitle = "";
  enteredContent = "";
  private mode = "create";
  private id: string;
  public post: Post;
  isLoading: boolean;
  form: FormGroup;
  imagePreview: string;
  imagePreview1: string;
  private authStatusSubscription: Subscription;
  filesToUpload: Array<File> = [];

  constructor(
    public postsService: PostsService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators:[mimeType] }),
      images: new FormControl(null)
    });

    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      // console.log(paramMap);

      if (paramMap.has("id")) {
        this.mode = "edit";
        this.id = paramMap.get("id");
        this.isLoading = true;
        //console.log(this.id);
        this.postsService.getPost(this.id).subscribe((postData: any) => {
          // console.log(postData);
          this.isLoading = false;

          this.post = {
            id: postData.post._id,
            title: postData.post.title,
            content: postData.post.content,
            imagePath: postData.post.imagePath,
            createdBy: postData.post.createdBy,
          };
          // console.log(this.post);

          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        }, ()=> {
          this.isLoading = false;
        });
      } else {
        this.mode = "create";
        this.id = null;
      }
    });

    this.authStatusSubscription = this.authService.getIsUserAuthenticatedSubject()
      .subscribe(authStatus => {
          this.isLoading = false;
      });
  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    //console.log(file);
    //console.log(this.form);
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.imagePreview = fileReader.result;
    };
    fileReader.readAsDataURL(file);
  }

  onImagePicked1(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image1: file });
    this.form.get("image1").updateValueAndValidity();
    //console.log(file);
    console.log(this.form);
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.imagePreview1 = fileReader.result;
    };
    fileReader.readAsDataURL(file);
  }

  onSavePost() {
    // console.log('***************');
    // console.log(this.form);
    // console.log('***************');

    //client side validation
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image,
        this.form.value.images,
      );
    } else {
      // console.log(this.form.value.content);

      this.post.content = this.form.value.content;
      this.post.title = this.form.value.title;
      this.post.imagePath = this.form.value.image;
      this.postsService.updatePost(this.post);
    }
    this.form.reset();
    // this.router.navigateByUrl('');
  }

  onImagePicked3(fileInput: any) {

    //const file = (event.target as HTMLInputElement).files[0];
    //this.form.patchValue({ image: file });

    this.filesToUpload = <Array<File>>fileInput.target.files;

    const formData: any = new FormData();
    const files: Array<File> = this.filesToUpload;

  //   const arr = new FormArray([
  //     new FormControl(),
  //     new FormControl(),
  //     new FormControl(),
  //     new FormControl(),
  //     new FormControl(),
  //     new FormControl(),
  //     new FormControl()
  //  ]);


    console.log(files);

    for(let i =0; i < files.length; i++){
        formData.append("uploads[]", files[i], files[i]['name']);
        //arr.ap([files[i]['name']]);
        //this.form.controls['images'].push(new FormControl(files[i]));


    }
    this.form.patchValue({ images: formData });
    console.log('koko',this.form);
    //return;
    //console.log('form data variable :   '+ formData.toString());
    //this.form.patchValue({ images: arr });
    //console.log(this.form.value);

    this.httpClient.post('http://localhost:3000/api/uploads/uploads', formData)
    //.map(files => files.json())
    .subscribe(files => console.log('files', files));

}

  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
  }
}
