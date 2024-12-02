# Workshop Project: SoftUni Forum
This repository contains my solution for the Angular Workshop, developed during the Angular course at SoftUni. The workshop is a step-by-step project that evolves over several parts, aligned with the course lectures.

### About the Workshop
* **Visual Design and Task Description**: Provided by SoftUni.
* **Solution Implementation**: Developed by me during the lectures, demonstrating the application of Angular concepts and techniques.

### Purpose
This project serves as a practical exercise to solidify my understanding of Angular by applying the concepts learned in the course.

### License
This project is not licensed for redistribution as it includes templates owned by SoftUni.

## Steps for Building the Project
### Part 1 of the Workshop
---
#### 1. Create the project folder, and set up the new Angular project in it with the command:
```
ng new project-name
```

#### 2. Clean up the initial HTML in the main app file, and start the app with the command:
```
ng serve
```

#### 3. Create a new folder `/core`, nested in `/app`, where we are going to create the components `header` and `footer`.
* This folder holds all core components.
* `Core components` are used throughout the application and are not tied to a specific feature or page.
* `ng g c header --skip-tests` & `ng g c footer --skip-tests`
* Add the newly created components to the `app.component.html`.
* Don't forget to import them in the `app.component.ts`.

#### 4. Set up the 2 core components - `header` and `footer`.
* Get the HTML and CSS code from the resources
* Add the `reset styling`, `typography`, and `responsive` in `styles.css` (the global CSS file).
* In order to `display` some of the buttons in the header `conditionally`, we can set this up as follows:
```
export class HeaderComponent {
  isLoggedIn = false;
}
```
```
@if (!isLoggedIn) {
  // Show some buttons here ...
}
```

#### 5. In order to visualize the logo image, we need to create an `/images` folder in the `/public` folder of the project, and then use the following path template: `images/my-file.jpg`

#### 6. Add the fonts to the `index.html` file.

#### 7. Create a new folder `/main`, nested in `/app`, where we are going to place our main section and its components. 
* `ng g c main --skip-tests`
* Add the newly created component to the `app.component.html`.
* Don't forget to import it in the `app.component.ts`.

#### 8. Create 2 new components, nested in `/main` - `themes-list` and `posts-list`.

#### 9. Create the folder `environments`, where we are going to place all environmental variables, that we are going to use throughout our files.: `ng g environments`
```
export const environment = {
    apiUrl: 'http://localhost:3000/api',
};
```
* Add the `apiUrl` variable to both the production and development environment files. 

#### 10. In `app.config.ts` add `provideHttpClient()`:
* The `provideHttpClient()` function is used to set up the HTTP client module in your application, allowing you to perform HTTP operations such as making API calls to retrieve or send data to a server. 
```
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};
```
* Leave the `AppComponent` as it is:
```
export class AppComponent {
  title = 'forum';
}
```

#### 11. Create a global API service, which is nested in the `/app` folder, and will take care entirely of the `HttpClient`.
* `ng g s api` - The service is `injectable`, meaning it can be provided to components or other services via Angular's `dependency injection system`.
```
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  getPosts(limit?: number) {
    const { apiUrl } = environment;

    let url = `${apiUrl}/posts`;

    if (limit) {
      url += `?limit=${limit}`;
    }
    
    return this.http.get<Post[]>(url);
  }
}
```
* The constructor injects **Angular's HttpClient service** `(private http: HttpClient)`, allowing the service to make HTTP requests.
* A limit of the records pulled can be set by appending the following string to the base URL: `?limit=${limit}`
* `this.http.get<Post[]>(url)` makes a GET request to the constructed URL, and expects to receive an array of Post objects.
* `http.get` returns an `Observable`, which allows the caller to `subscribe` to the response.
* `ApiService` is expected to be used across the application for all API calls, for example in the `PostListComponent`:
```
export class PostsListComponent implements OnInit {
  posts: Post[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getPosts().subscribe(posts => {
      this.posts = posts;
    });
  }
}
```
* By creating a new variable of type array of Posts, we can then use the result, assigned to it, throughout our HTML template:
```
<div>
          @for (post of posts; track $index) {
              <div class="aside-theme">
                  <a href="#">
                      <h3>{{ post.themeId.themeName }}</h3>
                      <p>{{post.userId.username}}</p>
                      <p><span>{{post.created_at}}</span></p>
                  </a>
              </div>
          }
      </div>
```
* The same should be applied for the Themes:
```
  getThemes() {
    const { apiUrl } = environment;
    return this.http.get<Theme[]>(`${apiUrl}/themes`);
  }
```

#### 12. Create a new folder `/types`, nested in `/app`, where we are going to add our interfaces behind the Posts, Users, Themes, etc.: 
  * `/post.ts`:
```
import { Theme } from "./theme";
import { User } from "./user";

export interface Post {
    "likes": string[];
    "_id": string;
    "text": string;
    "userId": User;
    "themeId": Theme;
    "created_at": string;
    "updatedAt": string;
    "__v": number;
} 
```
* An `interface` in TypeScript is a way to define a structure for objects, specifying their shape and the types of their properties. Interfaces act as contracts that ensure objects conform to specific requirements.

#### 13. Create a new folder `/shared`, nested in `/app`, which will contain our LoaderComponent. 
* The purpose of the `/shared` folder is to `store reusable components`, directives, and pipes that can be used across the entire Angular application. 
* `ng g c loader`
* Add the HTML and CSS code to it. 
* Implement it in the already existing code. For example, showing a loading circle, while the posts are being retrieved from the database:
```
<aside>
    @if (isLoading) {
        <app-loader />
    } @else {
        <div class="aside">
            <h2 class="title">
                Recent posts
            </h2>
            <div>
                @for (post of posts; track $index) {
                    // Generating the components structure ...
                }
            </div>
        </div>
    }
</aside>
```
```
export class PostsListComponent implements OnInit {
  posts: Post[] = [];
  isLoading = true;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getPosts().subscribe(posts => {
      this.posts = posts;
      this.isLoading = false;
    });
  }
}
```

### Part 2 of the Workshop
**1. Generate the new components for the rest of the views of the app.**

**2. Create a new folder `/user`, nested in `/app`, which will hold all user-related components (`login`, `register`, `profile`).**

**3. Create 2 new folders - `/theme` and `/posts-list`, and transfer the corresponding components to them.**

**4. Adjust the **app routing** from the `app.routes.ts` file:**
  * Check if `provideRouter(routes)` is injected in the `app.config.ts` file. `routes` is imported from `app.routes.ts`.
  * Replace the `<app-main />` component in `app.component.html` with `<router-outlet />` to dynamically render components based on the routing configuration in `app.routes.ts`.
  * In the `app.routes.ts` file set the paths, as follows:
```
export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full' },
    {path: 'home', component: HomeComponent}
];
```
  * Make sure that the `Error page` is included last in the routing configuration:
```
{path: '404', component: ErrorComponent},
{path: '**', redirectTo: '/404', pathMatch: 'full'},
```
* **Important Note**: The wildcard route (`'**'`) must always be the last entry to function correctly.

**5. To make the navigation buttons functional, follow these steps:**
  * Import `RouterLink` to the Header component.
  * Add the `routerLink` directive in the code, and  and set the appropriate path: `<a routerLink="/home">Home</a>`.

**6. Update the theme paths to enable opening a theme by its ID:**
```
{path: 'themes', children: [
  {path: '', component: MainComponent},
  {path: ':themeId', component: CurrentThemeComponent}
]},
```

**7. Add a new method to the `apiService` for `retrieving a single theme`:**
* In `api.service.ts`:
```
getSingleTheme(id: string) {
    const { apiUrl } = environment;
    return this.http.get<Theme>(`${apiUrl}/themes/${id}`);
  }
```
* The `routerLink` directive dynamically generates links. If you have a value that is **determined at runtime** (e.g., `theme._id`), you should use the square brackets `([])` to bind to that value. This ensures Angular evaluates the expression and sets the link dynamically.
* **Static links**: No brackets are needed because the path is constant.
```
<a routerLink="/home" class="normal">Home</a>
```
* **Dynamic links**: Use square brackets to bind the routerLink to a dynamic value or expression.
```
<a [routerLink]="theme._id" class="normal">
```
* In `current-theme.component.ts`:
```
export class CurrentThemeComponent implements OnInit {
  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['themeId'];

    this.apiService.getSingleTheme(id);
  }
}
```
* `ActivatedRoute`: Accesses the dynamic parameter (`themeId`) from the URL.
* `ApiService` method: Fetches the theme data from the server using the provided id.
* `Dynamic link [routerLink]`: Enables navigation to a URL corresponding to a specific theme.

**8. Update the template to render the data dynamically.**

**9. Add a method in the `apiService` to create a theme:**
```
createTheme(themeName: string, postText: string) {
    const { apiUrl } = environment;
    const payload = {
      themeName,
      postText
    }
    return this.http.post<Theme>(`${apiUrl}/themes`, payload);
  }
```
```
<input type="text" name="themeName" id="themeName" #inputThemeName>
<input type="text" name="postText" id="postText" #inputPostText>
<button class="public" (click)="addTheme($event, inputThemeName.value, inputPostText.value)">Post</button>
```
* You can add the `$event` parameter to prevent the form's default submission behavior when using a button inside a `<form>` tag. 
```
addTheme(event: Event, themeName: string, postText: string) {
  event.preventDefault();
}
```

**10. Create route guards for the app.**
* Create a folder `/guards` under `/app` to hold the guard files.
* In the folder, create a file `auth.guard.ts`:
```
export const AuthGuard: CanActivateFn = () => {
    const userService = inject(UserService);
    return userService.isLogged;
}
```
* Apply the guard to the routing configuration in `app.routes.ts`:
```
{path: 'add-theme', component: AddThemeComponent, canActivate: [AuthGuard]}
```
* `Route Guards` control access to routes based on custom logic, like whether the user is authenticated.

### Part 3 of the Workshop
**1. Apply template-driven form approach to the login form.**
  * Import `FormsModule` in the `.ts` file.
  * Update the code, by including `ngForm` and `bgSubmit`:
```
<form class="login" #form="ngForm" (ngSubmit)="login(form)">
```
  * Prevent the form from submitting if it is invalid: 
```
login(form: NgForm) {
  if (form.invalid) {
    return;
  }
}
```
  * Update the input fields, by including `ngModel` and the necessary attributes:
```
<p class="field field-icon">
  <label for="email">Email</label>
  <input 
  class="input-error" 
  type="email" 
  name="email" 
  id="email" 
  placeholder="john.doe@gmail.com" 
  required
  ngModel
  #inputEmail="ngModel">
</p>
```
* Create a new directive for checking the validity of the email: `ng g d email --skip-tests`
* Since we are expecting the email to end with either `.bg` or `.com`, we can add these values to a new constants file - `constants.ts`:
```
export const DOMAINS = ['bg', 'com'];
```
* The constants can then be used throughout the app. For example, to be included in the logic in the `.ts` file:
```
domains = DOMAINS;
```
* Attach the new directive to the email input field: 
```
<input type="email" ... [appEmail]="domains">
```
* Create a new folder `/utils`, which will hold all the helper functions, for example: `email.validator.ts`.
```
export function emailValidator(domains: string[]): ValidatorFn {
    const domainStr = domains.join('|');
    const regExp = new RegExp(`[A-z0-9]{6,}@gmail\.(${domainStr})`);

    return (control => {
        const isInvalid = control.value === '' || regExp.test(control.value);

        return isInvalid ? null : {emailValidator: true};
    });
}
```
* The `emailValidator` function creates a custom Angular form validator that checks if an email belongs to the Gmail domain and ends with a specified subdomain from a provided list (`.com` or `.bg`). If the email is valid or empty, the validator returns `null`. Otherwise, it adds an error object `{ emailValidator: true }` to indicate a validation failure.

* Here is how the `EmailDirective` is implemented:
```
export class EmailDirective implements Validator {
  @Input() appEmail: string[] = [];
  
  constructor() { }

  validate(control: AbstractControl): ValidationErrors | null {
    const validatorFn = emailValidator(this.appEmail);
    
    return validatorFn(control);
  }
}
```
* The directive assigns the `emailValidator` helper function to a variable (`validatorFn`), passing the control (`email field`) to it for validation. It returns the result of this validation to determine whether the email field is valid or has errors.
* An error message can be conditionally shown, based on the result of the email validation: 
```
@if (inputEmail?.touched) {
    <div>
        @if (inputEmail?.errors?.['required']) {
            <p class="error">Email is required!</p>
        }
        @if (inputEmail?.errors?.['emailValidator']) {
            <p class="error">Email is not valid!</p>
        }
    </div>
}
```
* Classes can be conditionally included as well:
```
<input [class]="inputEmail?.touched && (inputEmail?.errors?.['required'] || inputEmail?.errors?.['emailValidator']) ? 'input-error' : ''"
```
* A button can be made unclickable conditionally too:
```
<button [disabled]="form.invalid">Login</button>
```
* The steps above are repeated for the password field as well.
* The input lenght can be validated, thanks to the `minlength` attribute: 
```
<input type="password" name="password" id="password" placeholder="******" required ngModel #inputPassword="ngModel" minlength="5">
```

**2. Apply Reactive approach to the register form.**
* Import the `ReactiveFormsModule`. 
* Set up the form controls, and add the necessary validations:
```
form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    telephone: new FormControl(''),
    password: new FormControl('', [Validators.required]),
    rePassword: new FormControl('', [Validators.required])
  });
```
* Update the form template, by including `formGroup` and `ngSubmit`:
```
<form class="register" [formGroup]="form" (ngSubmit)="register()">
```
* Buttons can be disabled conditionally until the form becomes valid:
```
<button [disabled]="form.invalid">Create Account</button>
```
* Update the form by adding the relevant `formControlName`s:
```
<input type="email" name="email" id="email" formControlName="email">
```
* Show error messages conditionally:
```
@if (form.get('username')?.touched) {
    <div>
        @if (form.get('username')?.errors?.['required']) {
            <p class="error">Username is required!</p>
        }
    </div>
}
```
* To optimize our code readability, we can use variables and their `getters`:
```
get isUsernameRequired() : boolean {
  return this.form.get('username')?.touched && this.form.get('username')?.errors?.['required'];
} 
```
```
@if (isUsernameRequired) {
    <p class="error">Username is required!</p>
}
```
* Include the `email validator` in the validations array of the email form control:
```
email: new FormControl('', [Validators.required, emailValidator(DOMAINS)]),
```
* To minimize repetitive functions, the function for required fields can be made universal: 
```
isFieldEmpty(controlName: string) {
  return this.form.get(controlName)?.touched && this.form.get(controlName)?.errors?.['required'];
}
```
```
@if (isFieldEmpty('username')) {
  <p class="error">Username is required!</p>
}
```
* It's good practice to wrap the password fields in a `form group`.
```
passGroup: new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    rePassword: new FormControl('', [Validators.required])
  }, 
{
  validators: [matchPasswordsValidator('password', 'rePassword')]
})
```
* Create a new passwords validator function to check if the two password fields are matching:
```
export function matchPasswordsValidator(passwordControlName: string, rePasswordControlName: string) : ValidatorFn {
    return (control) => {
        const passwordFormControl = control.get(passwordControlName);
        const rePasswordFormControl = control.get(rePasswordControlName);

        const passwordsAreMatching = passwordFormControl?.value === rePasswordFormControl?.value;

        return passwordsAreMatching ? null : { matchPasswordsValidator: true };
    };
}
```
* Password fields (and their labels) can be nested under a `<div>` container: 
```
<div formGroupName="passGroup"></div>
```
* To optimize the code's readability, a `getter` for the entire passwords form group can be created, and used throughout the code:
```
get passGroup() {
  return this.form.get('passGroup');
}
```
```
@if (form.get('passGroup')?.get('password')?.errors?.['required']) {
    <p class="error">Password is required!</p>
}
```
**3. Apply Template-driven approach to the Add theme form.** 

**4. Update the My Profile component.**
* Include the Edit profile template from the resources, and separate the code to `READONLY MODE`, and `EDIT MODE`. Make use of `<ng-container>`, which provide 'invisible' wrappers. 
* Introduce a new variable, which will serve as a toggle for showing and hiding the edit mode: `showEditMode`:
```
showEditMode: boolean = false;

toggleEditMode() {
  this.showEditMode = !this.showEditMode;
}
```
* Show the two modes conditionally, namely: if `showEditMode === true`, show `EDIT MODE`, otherwise - show `READONLY MODE`.
* Add Reactive form approach for the edit form itself. Include the necessary validations. 
* Add the `handleSaveProfile()` function, which will save the updated data locally (for now), and will toggle the boolean variable:
```
handleSaveProfile() {
  if (this.form.invalid) {
    return;
  }
  this.profileDetails = this.form.value as ProfileDetails;
  this.toggleEditMode();
}
```
```
<form [formGroup]="form" (ngSubmit)="handleSaveProfile()">
...
  <button class="red-button" (click)="handleCancel($event)">Cancel</button>
  <button class="green-button" [disabled]="form.invalid">Save</button>
</form>
```
* Include the `handleCancel()` function too, which will toggle the boolean variable:
```
handleCancel(event: Event) {
  event.preventDefault();
  this.toggleEditMode();
}
```
* By default, Angular submits with all buttons, available in the form, and this is why it is necessary to `prevent this default behavior` for all the buttons, that we do not want to work like that.
