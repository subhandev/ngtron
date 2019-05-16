import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../shared/auth.service';
import {ToastrService} from 'ngx-toastr';


import {User} from '../shared/User';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    user = new User();
    registerForm: FormGroup;
    emailPattern = '^(([^<>()[\\]\\\\.,;:\\s@"]+(\\.[^<>()[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';
    isLoading: boolean = false;


    constructor(private authService: AuthService,
                private toastr: ToastrService,
                private router: Router) {
    }

    ngOnInit() {
        this.registerForm = new FormGroup({
            'firstName': new FormControl(this.user.firstName, [Validators.required]),
            'lastName': new FormControl(this.user.lastName, [Validators.required]),
            'email': new FormControl(this.user.email, [Validators.required, Validators.pattern(this.emailPattern)]),
            'password': new FormControl(this.user.password, [Validators.required])
        });
    }

    get firstName() {
        return this.registerForm.get('firstName');
    }

    get lastName() {
        return this.registerForm.get('lastName');
    }

    get email() {
        return this.registerForm.get('email');
    }

    get password() {
        return this.registerForm.get('password');
    }


    save(): null {
        const user: User = this.registerForm.value;
        this.isLoading = true;
        return this.authService
            .save(user)
            .then(
                res => {
                    this.isLoading = false;
                    this.toastr.success('Message', 'User Saved Successfully!');
                    // console.log(res);
                    return this.router.navigate(['/login']);
                }, error => {
                    this.isLoading = false;
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    this.toastr.error(errorMessage, errorCode);
                    this.registerForm.reset();
                });
    }


}
