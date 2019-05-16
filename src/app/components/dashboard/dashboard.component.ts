import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth/shared/auth.service';
import {Router} from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    closeResult: string;
    emailForm: FormGroup;
    emailPattern = '^(([^<>()[\\]\\\\.,;:\\s@"]+(\\.[^<>()[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';
    multiEmailPattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9\-]+\.)+([a-zA-Z0-9\-\.]+)+([;]([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9\-]+\.)+([a-zA-Z0-9\-\.]+))*$/;
    isLoading: boolean = false;
    @ViewChild('composeBtn') composeBtn: ElementRef;
    sentMailList = JSON.parse(localStorage.getItem('sentMailList')) || [];
    Editor = ClassicEditor;
    editorData = '';
    validators = [this.checkEmail];
    errorMessages = {
        'checkEmail': 'Enter valid email address.'
    };
    itemsRef: AngularFireList<any>;
    items: Observable<any[]>;

    constructor(private modalService: NgbModal,
                private authService: AuthService,
                private router: Router,
                private db: AngularFireDatabase) {

        this.itemsRef = db.list('emails');
        // this.items = this.itemsRef.valueChanges();

        // Use snapshotChanges().map() to store the key
        this.items = this.itemsRef.snapshotChanges().pipe(
            map(changes =>
                changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
            )
        );

        console.log(this.items);
    }

    updateItem(key: string, newText: string) {
        this.itemsRef.update(key, {text: newText});
    }

    deleteItem(key: string) {
        this.itemsRef.remove(key);
    }

    deleteEverything() {
        this.itemsRef.remove();
    }


    ngOnInit() {

        this.emailForm = new FormGroup({
            'to': new FormControl('', [Validators.required]),
            'cc': new FormControl('', []),
            'subject': new FormControl('', [Validators.required]),
            'content': new FormControl('', [Validators.required]),
        });

        // setTimeout(() => {
        //     this.composeBtn.nativeElement.click();
        // }, 0);
    }

    open(content) {
        this.modalService
            .open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'})
            .result.then(
            (result) => {
                this.closeResult = `Closed with : ${result}`;
                this.emailForm.reset();
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissedReason(reason)}`;
                // this.emailForm.reset();
            }
        )
        ;
    }

    getDismissedReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }


    checkEmail(control: FormControl) {
        const emailPattern = new RegExp('^(([^<>()[\\]\\\\.,;:\\s@"]+(\\.[^<>()[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');
        if (!emailPattern.test(control.value)) {
            return {
                'checkEmail': true
            };
        }
        return null;
    }

    pluckEmails(emails) {
        return emails.map(item => item.display).join(", ");
    }

    sendEmail(modal) {
        const email = this.emailForm.value;
        this.isLoading = true;
        const promise = this.itemsRef.push(email);
        promise
            .then(res => {
                this.isLoading = false;
                modal.close(email);
                // console.log(res);
            })
            .catch(err => console.log(err, 'You do not have access!'));

        // const sentMailList = JSON.parse(localStorage.getItem('sentMailList')) || [];
        // this.isLoading = false;
        // this.sentMailList.push(email);
        // localStorage.setItem('sentMailList', JSON.stringify(this.sentMailList));
    }

    logout() {
        this.authService.logout();
        localStorage.removeItem('sentMailList');
        this.router.navigate(['/login']);
    }

}
