# Workshop Project: SoftUni Forum
This repository contains the solution for the Angular Workshop, developed alongside the Angular course at SoftUni. The workshop is a step-by-step project that evolves over multiple parts, closely following the course lectures.

### About the Workshop
* **Visual Design and Task Description**: Provided by SoftUni.
* **Solution Implementation**: Developed progressively during the lectures, applying Angular concepts and best practices introduced throughout the course.

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
  * Update the code, by including `ngForm` and `ngSubmit`:
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

### Part 4 of the Workshop
**1. Create an interceptor**
* `ng g interceptor app --skip-tests`
* An interceptor in Angular is a service that intercepts and modifies HTTP requests and responses globally. 
* Interceptors allow you to handle logic that applies to all HTTP requests in one place, instead of duplicating the same logic across components or services.
* Interceptors can catch and handle errors for all HTTP requests in a centralized manner.
* After generating the interceptor, we need to include it in the `app.config.ts` file:
```
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([appInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes)]
};
```
* The app interceptor should have the following logic - if the HTTP request starts with `'/api'`, then this part of the request should be replaced with the `localhost:...` URL, saved as an environment variable:
```
const { apiUrl } = environment;
const API = '/api';

export const appInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith(API)) {
    req = req.clone({
      url: req.url.replace(API, apiUrl),
      withCredentials: true,
    });
  }
  return next(req);
};
```
* We need to ensure that we are using `withCredentials: true`, as this will attach the auth cookie to the browser.
* Introducing the app interceptor helps us simplify the code in our services. We can now transform this method:
```
getThemes() {
  const { apiUrl } = environment;
  return this.http.get<Theme[]>(`${apiUrl}/themes`);
}
```
to this:
```
getThemes() {
  return this.http.get<Theme[]>('/api/themes');
}
```
**2. Set up the login functionality.**
* After injecting the HttpClient in our user service, we can safely create the login functionality.
* We start by creating a `Behavioral Subject` for holding the user data, and by exposing the `user$` observable by calling `asObservable()` to ensure that **external consumers can only subscribe to updates without modifying the BehaviorSubject directly.**:
```
private user$$ = new BehaviorSubject<UserForAuth | null>(null);
private user$ = this.user$$.asObservable();
```
* Then, we are passing the email and the password as arguments, which are then pushed as payload to the post request. It expects to receive the response in the format of `<UserForAuth>`. If the request is successful, then we would like to pipe the result, and 'tap' it, so we can assign the value to the `user$$` subject.
```
login(email: string, password: string) {
  return this.http.post<UserForAuth>('/api/login', { email, password })
  .pipe(tap((user) => this.user$$.next(user)));
}
```
* We should not forget to update the login `.ts` file:
```
login(form: NgForm) {
  if (form.invalid) {
    return;
  }

  const { email, password } = form.value;

  this.userService.login(email, password).subscribe(() => {
    this.router.navigate(['/themes']);
  });
}
```
---
**What is the benefit of using a BehaviorSubject for storing user data?**

**1. Holds the Latest Value**
* A **BehaviorSubject** always stores the latest emitted value. This is ideal for user data because you want to know the current state of the user (e.g., logged in or not) at any given point.

**2. Immediate Access to the Current Value**
* When a new subscriber subscribes to the `user$` observable, it immediately receives the current value of the `BehaviorSubject`. This is particularly useful for authentication states, where you need the latest user information as soon as a component is initialized.

**3. Reactive Data Flow**
* With a `BehaviorSubject`, you can push updates (e.g., new user data) and have those changes automatically propagated to all subscribers. This enables a reactive design, where components or services consuming the `user$` observable automatically reflect changes (e.g., when a user logs in, logs out, or their details are updated).

**4. Read-Only Observable for Consumers**
* By exposing the `user$` observable (via `asObservable()`), you ensure that other parts of the application **can only listen to the data without modifying it**. This encapsulation makes the code more robust and prevents accidental state changes.

**5. Simplifies Sharing State**
* Multiple components or services can subscribe to the same `user$` observable, reducing the need for duplicating logic or manually passing user data around.
---

**3. Set Up the Register Functionality.**
* We create the register functionality by passing the new user data to the system via a POST request. If the request passes successfully, then we would like to save the newly created user data to the BehaviorSubject `user$$`:
```
register(username: string, email: string, telephone: string, password: string, rePassword: string) {
  return this.http.post<UserForAuth>('/api/register', { username, email, telephone, password, rePassword })
  .pipe(tap((user) => this.user$$.next(user)));
}
```
* We should not forget to update the register `.ts` file as well:
```
register() {
  if (this.form.invalid) {
    return;
  }
  const { username, email, telephone, passGroup: {password, rePassword} = {} } = this.form.value;

  this.userService.register(username!, email!, telephone!, password!, rePassword!)
  .subscribe(() => {
    this.router.navigate(['/themes']);
  });
}
```
**4. Set Up the Get Profile Functionality.**
```
getProfile() {
  return this.http.get<UserForAuth>('/api/users/profile')
  .pipe(tap((user) => this.user$$.next(user)));
}
```

**5. Create a wrapper, which will authenticate everything that is inside of it.**
* `ng g c authenticate --skip-tests`
* The `AuthenticateComponent` ensures that any content inside it is only displayed after the user's authentication status is checked. While the app is fetching the user's profile, it displays a loading sign (`isAuthenticating = true`). Once the process is complete, it renders the appropriate content:
```
export class AuthenticateComponent implements OnInit {
  isAuthenticating = true;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: () => {
        this.isAuthenticating = false;
      },
      error: () => {
        this.isAuthenticating = false;
      }, 
      complete: () => {
        this.isAuthenticating = false;
      }
    })
  }
}
```
* In order to render the loading animation conditionally, we need to use the following code in the template - if the profile is still getting fetched, the loading animation will be displayed; otherwise, the content, that the authenticate component wraps, will be shown:
```
@if (isAuthenticating) {
    <app-loader />
} @else {
    <ng-content />
}
```
* This functionality can easily be tested by switching to 'Slow 4G' in the Network tab of the browser.
* This is how we are supposed to wrap the entire component in the `app` component file:
```
<app-authenticate>
    <app-header />
    <router-outlet />
    <app-footer />
</app-authenticate>
```

**6. Set Up the Logout Functionality.**
* We are making a POST request, and as a result, the `user$$` BehaviorSubject has now a value of `null`.
```
logout() {
  return this.http.post('/api/logout', { })
  .pipe(tap((user) => this.user$$.next(null)));
}
```
* Do not forget to edit it in the header, where the logout button is set:
```
logout() {
  this.userService.logout().subscribe(() => {
    this.router.navigate(['/home']);
  });
}
```

**7. Update the service constructor.**
```
constructor(private http: HttpClient) {
  this.user$.subscribe((user) => this.user = user);
}
```
* We subscribe to the `user$` observable, which means the code will react whenever the value of the observable changes.
* Whenever `this.user$` emits a new value (which happens when `this.user$$` is updated), the callback function is executed, and the new user data is assigned to the `this.user` property.

**8. Add theme**
* Update the add theme method for creating new themes:
```
addTheme(form: NgForm) {
  if (form.invalid) {
    return;
  }
  const { themeName, postText } = form.value;

  this.apiService.createTheme(themeName, postText).subscribe(() => {
    this.router.navigate(['/themes']);
  });
}
```

**9. Create Error Interceptor.**
* Create it in the `core/` folder and name it `error-msg`.
* Create a service in the `error-msg` component folder and name it the same way:
```
export class ErrorMsgService {
  private apiError$$ = new BehaviorSubject(null);
  public apiError$ = this.apiError$$.asObservable(); 

  constructor() {}

  setError(error: any): void {
    this.apiError$$.next(error);
  }
}
```
* Add the provided CSS formatting in the CSS file for the error-msg component.
* Add the necessary HTML content - usually a paragraph, with the necessary error classes.
* We need an additional routing path for the error message. 
```
{path: 'error', component: ErrorMsgComponent},
{path: '404', component: ErrorComponent},
{path: '**', redirectTo: '/404', pathMatch: 'full'},
```
* Now in the app interceptor, we need to set these errors somehow. We need to inject the errorService and the router in the app interceptor. After that, we would want to catch the error from an HTTP response if there is such, and then, if it has a status 401, we need to navigate to the login page. Otherwise, we would like to send the error message to the setError method of the errorService and then we need to navigate to the 'error' path, because this way, we will be able to render the error visually.
```
const errorService = inject(ErrorMsgService);
const router = inject(Router);

return next(req).pipe(
  catchError((err) => {
    if (err.status === 401) {
      router.navigate(['/login']);
    } else {
      errorService.setError(err);
      router.navigate(['/error']);
    }

    return [err];
  })
);
```
```
export class ErrorMsgComponent implements OnInit {
  constructor(private errorMsgService: ErrorMsgService) { }

  errorMsg : string = '';  

  ngOnInit(): void {
    this.errorMsgService.apiError$.subscribe((err: any) => {
      this.errorMsg = err?.message;
    })
  }
}
```

**10. Lazy Load the components.**
* **Lazy loading** is a technique where components or modules are loaded only when they are needed, instead of loading them at the initial application startup.
* We can start by refactoring the path to the `add-theme` component. As a result, the `AddThemeComponent` will only be loaded when the user navigates to `add-theme`.:
```
{
    path: 'add-theme',  
    loadComponent: () => import('./theme/add-theme/add-theme.component').then((c) => c.AddThemeComponent),
    canActivate: [AuthGuard]
},
```
* Now, if we open the Network tab in the browser, we can see that a chunk has been loaded.
* We can proceed by updating all of the paths to load their corresponding components lazily.
* **Why Load All Components Lazily?**
  * `Reduces Initial Bundle Size` – The application starts faster because it doesn’t load unnecessary components upfront.
  * `Optimizes Performance` – Only required components are loaded when needed, improving responsiveness.
  * `Better Scalability` – As the app grows, lazy loading helps prevent performance degradation.
  * `Efficient Resource Usage` – Browser memory and processing are used more efficiently by loading only the necessary parts of the app.
* **When Should You NOT Use Lazy Loading?**
  * For components that are always needed on the first load, like a **navbar** or **footer**.
  * If the component is small and used frequently, eager loading might be fine.

**11. Pipes.**
* Create a new folder `/pipes` in the `/shared` folder. Create a new pipe in it with the command: `ng g pipe slice --skip-tests`.
* Generate a second pipe, called `elapsed-time`.
* The `@Pipe` decorator marks this class as an Angular Pipe, which allows it to be used for **transforming data in templates**.
* The pipe is standalone, meaning it doesn't need to be declared in an `NgModule`. You can directly import and use it in components.
* `export class SlicePipe implements PipeTransform` - `PipeTransform` is an Angular interface that enforces the `transform()` method (which actually performs the transformation). The new pipe is required to define its own version of the `transform()` method. By implementing `PipeTransform`, your class is required to have a `transform()` method, but Angular does not provide any built-in logic for it.
* In order to use the custom pipe in a template, we need to import it in the `.ts` file firstly. We should be careful when importing pipes, because there are already some that are built-in, and we should make sure that we are importing the correct one. As a result, we will be able to use it in the template as follows:
```
<h2>{{theme.themeName | slice: 25}}</h2>
```
* Here is the implementation of the custom slice pipe - if the length of the string value is greater than the max char count, then '...' will be appended to it. Otherwise, the entire title will be displayed:
```
export class SlicePipe implements PipeTransform {

  transform(value: string, maxCharCount: number = 5): unknown {
    const dots = value.length > maxCharCount ? '...' : '';

    return `${value.substring(0, maxCharCount)}${dots}`;
  }
}
```
* The custom elapsed time pipe can show the number of days or hours that have passed since the creation, thanks to the `moment.js` and `@types/moment` libraries:
```
import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'elapsedTime',
  standalone: true
})
export class ElapsedTimePipe implements PipeTransform {

  transform(date: string, ...args: unknown[]): unknown {
    return moment(date).fromNow();
  }
}
```
* We can also make use of the built-in Angular pipes, and transform the way the date is being displayed in the themes (for this, we will need to import the `DatePipe` firstly in the `.ts` file):
```
<p>Date: <time>{{theme.created_at | date: "YYYY-MM-dd hh:mm"}}</time></p>
```

**12. Add the update profile functionality.**
* Add a method to the user service:
```
updateProfile(username: string, email: string, telephone?: string) {
  return this.http.put<UserForAuth>('/api/users/profile', { username, email, telephone })
  .pipe(tap((user) => this.user$$.next(user)));
}
```
* Refactor the Profile component:
1. This stores the user’s profile details, and it's initialized with empty strings until data is loaded.
```
profileDetails: ProfileDetails = {
  username: '',
  email: '',
  tel: ''
}
```
2. Fetching User Profile on Initialization
```
ngOnInit(): void {
  this.userService.getProfile().subscribe((user) => {
    if (user) {  
      this.profileDetails = {
        username: user.username,
        email: user.email,
        tel: user.tel ?? ''
      };

      this.form.setValue({
        username: user.username, 
        email: user.email,
        tel: user.tel ?? ''
      });
    }
  });
}
```
* When the component loads (`ngOnInit()`), it calls `getProfile()` from UserService to fetch the logged-in user’s data. If data exists, it:
  * Updates `profileDetails`.
  * Populates the form with the user's details using `form.setValue()`.
  * `tel ?? ''` ensures that if `tel` is null or undefined, it defaults to an empty string.

3. Save Profile Changes
```
handleSaveProfile() {
  if (this.form.invalid) {
    return;
  }

  this.profileDetails = this.form.value as ProfileDetails;
  const { username, email, tel } = this.profileDetails;

  this.userService.updateProfile(username, email, tel).subscribe(() => {
    this.toggleEditMode();
  });
}
```
* Checks if the form is valid.
* Extracts updated values from this.form.value and updates profileDetails.
* Sends a request to update the profile using this.userService.updateProfile(username, email, tel).
* After a successful update, it toggles edit mode back to view mode.