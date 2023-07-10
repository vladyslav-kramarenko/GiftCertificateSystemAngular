import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CertificateService} from '../shared/services/certificate.service';
import {Certificate} from '../shared/models/ICertificate';
import {Tag} from '../shared/models/ITag';
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../shared/confirm-dialog/confirm-dialog.component";
import {ImageService} from "../shared/services/image.service";
import {finalize} from 'rxjs/operators';
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-certificate-edit',
  templateUrl: './certificate-edit.component.html',
  styleUrls: ['./certificate-edit.component.scss']
})

export class CertificateEditComponent implements OnInit {

  editForm: FormGroup;
  headerText = 'Edit Certificate';
  certificate: Certificate = <Certificate>{};
  tags: Tag[] = [];
  newTag: string = '';
  isNew: boolean;
  imagePreview = '';

  constructor(
    private formBuilder: FormBuilder,
    private certificateService: CertificateService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private imageService: ImageService
  ) {
    this.editForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      duration: ['', Validators.required],
      img: [''],
      tags: [''],
    });
    this.isNew = this.route.snapshot.params['id'] === undefined;
    this.certificate.id = this.isNew ? '' : this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.editForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      duration: new FormControl('', Validators.required),
      img: new FormControl(''),
      tags: new FormControl(''),
    });
    if (!this.isNew) {
      this.certificateService.getCertificate(this.certificate.id).subscribe((data: Certificate) => {
        this.certificate = data;
        this.tags = this.certificate.tags;
        this.editForm.patchValue({
          name: this.certificate.name,
          description: this.certificate.description,
          price: this.certificate.price,
          duration: this.certificate.duration,
          img: this.certificate.img,
          tags: this.tags.map(tag => tag.name).join(', ')
        });
        this.imagePreview = this.certificate.img || environment.default_certificate_image;
      });
    }
  }

  onFormSubmit(): void {
    let formData: Certificate = this.editForm.value;
    formData.tags = this.tags;

    formData.img = this.certificate.img;

    if (this.isNew) {
      this.certificateService.createCertificate(formData).subscribe((response) => {
        const newCertificate: Certificate = response.body;
        this.router.navigate(['/certificates', newCertificate.id]);
      });
    } else {
      this.certificateService.updateCertificate(this.certificate.id, formData).subscribe(() => {
        this.snackBar.open('Certificate was updated!', 'Close', {
          duration: 2000,
        });
        this.router.navigate(['/certificates', this.certificate.id]);

      });
    }
  }

  deleteCertificate(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        message: 'Are you sure you want to delete this certificate?',
        title: 'Delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.certificateService.deleteCertificate(this.certificate.id).subscribe(() => {
          this.snackBar.open('Certificate deleted!', 'Close', {
            duration: 2000,
          });
          this.router.navigate(['/home']);
        });
      }
    });
  }

  addTag(): void {
    if (this.newTag.trim()) {
      let newTag: Tag = {
        name: this.newTag.trim(),
        _links: {}
      };
      this.tags.push(newTag);
      this.newTag = '';
      this.editForm.controls['tags'].setValue(this.tags.map(tag => tag.name).join(', '));
    }
  }

  onFileChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const file = files[0];
      this.imageService.uploadImage(file)
        .pipe(finalize(() => {
          this.editForm.controls['img'].setValue(this.certificate.img);
        }))
        .subscribe(data => {
          // Assuming your endpoint returns the saved file name or path
          this.certificate.img = data.filename || data.path;
          console.log("this.certificate.img="+this.certificate.img);

          const reader = new FileReader();
          reader.onload = e => {
            if (typeof reader.result === 'string' && reader.result.length > 0) {
              this.imagePreview = reader.result;
            } else {
              this.imagePreview = environment.default_certificate_image;
            }
            console.log("imagePreview:" + this.imagePreview);
          };
          reader.readAsDataURL(file);
        }, error => {
          console.error('Error uploading file', error);
        });
    }
  }


  removeTag(index: number): void {
    this.tags.splice(index, 1);
    this.editForm.controls['tags'].setValue(this.tags.map(tag => tag.name).join(', '));
  }
}
