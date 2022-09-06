import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  //VARIABLES USED FOR HTML
  username:string="";
  password:string="";
  email:string="";
  role:string="";
  

  constructor(private router:Router, private form:FormsModule, private http: HttpClient) { }

  ngOnInit() {
    console.log(sessionStorage);
    
    if(sessionStorage.getItem("username") != null) {
      alert("You're already logged in.");
      
    }
  }

  public loginUser(event) {
    event.preventDefault();

    //VALIDATING IF USERNAME AND PASSWORD HAS BEEN INPUTTED, IF DETAILS ARE INCORRECT THEN THE USER IS ALERTED THAT USERNAME AND/OR EMAIL IS INCORRECT, OTHERWISE LOGIN SUCCESSFUL -> NAVIGATED TO CHAT PAGE
    if (this.username === "" && this.password === "") {
      alert("Username and Password cannot be empty.");
      return;
    } else if (typeof(Storage) !== "undefined") {
      const req = this.http.post('http://localhost:3000/api/auth', {
        username: this.username,
        password: this.password,
      })

      .subscribe((data: any) => {
        if (data.success) {
          alert("Login Successful.");
          this.router.navigateByUrl('/chat');
          sessionStorage.setItem("username", data.username);
          sessionStorage.setItem("password", data.password);
          sessionStorage.setItem("email", data.email);
          sessionStorage.setItem("role", data.role);
        } else {
          alert("Username and/or Password are incorrect.");
        }
      },
      err => {
        alert("An error has occured.");
        return;
      });
    } else {
      console.log("Storage broke");
      return;
    }

  }
}
