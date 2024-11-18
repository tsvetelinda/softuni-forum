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