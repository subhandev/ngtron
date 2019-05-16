import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../shared/auth.service';
import {ToastrService} from 'ngx-toastr';

import {User} from '../shared/User';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    user: User = new User();
    loginForm: FormGroup;
    emailPattern = '^(([^<>()[\\]\\\\.,;:\\s@"]+(\\.[^<>()[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';
    isLoading: boolean = false;

    constructor(private authService: AuthService,
                private toastr: ToastrService,
                private router: Router) {
    }

    ngOnInit() {
        this.loginForm = new FormGroup({
            'email': new FormControl(this.user.email, [Validators.required, Validators.pattern(this.emailPattern)]),
            'password': new FormControl(this.user.password, [Validators.required])
        });
    }

    get email() {
        return this.loginForm.get('email');
    }

    get password() {
        return this.loginForm.get('password');
    }

    login() {
        const user: User = this.loginForm.value;
        this.isLoading = true;
        return this.authService
            .login(user)
            .then(
                res => {
                    this.isLoading = false;
                    // this.toastr.success('Message', 'User Saved Successfully!');
                    // console.log(res);
                    this.router.navigate(['/dashboard']);
                }, error => {
                    this.isLoading = false;
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    this.toastr.error(errorMessage, errorCode);
                    // this.registerForm.reset();
                });
    }

}
