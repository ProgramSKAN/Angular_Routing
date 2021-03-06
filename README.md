# Angular_Routing

#### In production change the base href from '/' to '/APM'

ng build --base-href /APM/

####

paths are case sensitive.

order of the routes matters.router uses first match win strategy.so,more specific path should always be before less specific path

{path:'welcome',redirectTo:'home',pathmatch:'full'}

redirect route can't be changed to another redirect.

redirects can be local or absolute.above is local redirect.prefix of / is needed for absolute redirect

Use RouteModule.forRoot() for app routes (must be one time only)

Use RouteModule.forChild() for feature routes

since route order matters, forchild routes seen first.later forroot

#### '/welcome' > HTML5 urls (default) | "#/welcome' > hash based urls

for hash based urls use RouteModule.forRoot([...],{useHash:true})

####

if we use secondary routes inluding primary like '/products(popup:messages)' then unlike router.navigateByUrl, router.navigate keeps the secondary routes.

use navigateByUrl to ensure every existing route parameter & secondary route is removed.ex:we use it for logout route

#### route parameters

use '/products/:id/edit' for edit product page
use '/products/0/edit' for Add product page, because edit component can be reused

use this.route.snapshot.paramMap when we need to read parameter only once and it never changes

use this.route.paramMap.subscribe when we need to read changing parameter

#### optional route paramaters

defined in curly braces with key value.

optional route parameters must always be after required route parameters

#### Prefetching Data Using Route Resolvers

used to prevent partial page load due to time taken to retrive data.

using resolvers page is loaded only after the full data is retrieved.prevents display of partial page

prevent routing to page where there an error.improves flow when error occurs.

#### Route 'data' property in RouterModule.forChild

{path:'products',component:ProductListComponent,data:{pageTitle:'Product List'}}

this.route.snapshot.data['pageTitle']//no need to use observable since it cannot change through out the lifetime of app

used to provide any arbitrary data to a route.Data defined in 'data' property cannot change through out the lifetime of the application.so we use it for static data.Ex:pageTitle

#### child routes

to define routes within other routes.ie.to display routed component templates within other routed component template.

tabs/breadcrumbs are nice way to show child routes.

child routes can be used to build master/detail style page

child routes are required for lazy loading

Absolute path(begins with /) for child route::::<a [routerLink]="['/products',product.id,'edit','info']">Info</a>
::::this.router.navigate(['/products',this.product.id,'edit','info'])

Relative path(does not begins with /) for child route::::<a [routerLink]="['info']">Info</a>
::::this.router.navigate(['info'],{relativeTo: this.route})::::this.route is ActivatedRoute

#### validation across child routes

how to get validation to disable save button if save button is in parent route and form is in child route?

sol:Define form in parent component::::<form><router-outlet></router-outlet></form> :::: won't work

sol:Define form in each child component::::wont work

sol:define all info,tags breadcrumb tab elements in one componenet::::works but difficult to maintain

sol:define form in each child component , perform manual validation::works

#### Grouping and Component-less Routes

router-outlet in app.component.html renders the ProductListComponent,ProductDetailComponent,ProductEditComponent(info,edit renders in child router-outlet of ProductEditComponent).but for grouping purpose we move ProductDetailComponent,ProductEditComponent to children but where render it.if you put child router-oulet in parent components template which is ProductListComponent then ProductDetailComponent,ProductEditComponent in child router-oulet renders in ProductListComponent template which is not expected.so move ProductListComponent to child as well.so parent component {paht:'products'} doesn't have component.so, its called component less route

this is also useful for lazy loading

#### styling

routerLinkActive='active'::::applies 'active' class to route

[routerLinkActiveOptions]="{exact:true}"::::applies style class set by routerLinkActive for the route that exactly fully matches

#### Animating route Transtions

step1:import BrowserAnimationsModule

step2:Define the desired animations

step3:Register the animation with component

step4:trigger the animation from router outlet

#### watching routing events

{enabletracing:true}> it prints the Router Events in console

Router Event sequence::::NavigationStart,RoutesRecognized,GuardsCheckStart,ChildActivationStart,ActivationStart,GuardsCheckEnd,ResolveStart,ResolveEnd,ActivationEnd,ChildActivationEnd,NavigationEnd

#### Reacting to routing events

used to display spinner,log actions,Execute logic

#### Secondary routes

used to display dashboad with multiple panels that each support multiple routes. (like powerbi dashboard)

used to build multiwindow application like outlook,Gmail

used to display second panel that allows user to take notes or make comments

used to display messages or other information to the user....

#### how does router know where to disply secondary router-outlet

each secondary must have a name. ex:<router-outlet name="popup"></router-outlet>.we use that name to tell the router to place the secondary content in a specific outlet.

we can define any number of secondary router-oulet at the same level/same html template of the hierarchy but each must have a unique name.

#### Activating secondary routes

[routerLink]="[{outlets:{popup:['messages']}}]" :: popup is the name of the outlet

###### we can redirect to multiple router outlets(primary and secondary) at once>>

[routerLink]="['/products',product.id,'edit',{outlets:{popup:['summary',product.id]}}]" or

this.router.navigate(['/products',product.id,'edit',{outlets:{popup:['messages']}}])

###### by default primary router-outlet has name 'primary', so below code also works

this.router.navigate([,{outlets:{
primary:['/products',product.id,'edit'],
popup:['messages']
}}])

###### or manually build url

this.router.navigateByUrl('/products/5/edit(pop:summary/5)')

#### clear secondary router-outlet

[routerLink]="[{outlets:{popup:null}}]"

or this.router.navigate([{outlets:{popup:null}}])

or manually clear secondary router-outlet info> this.router.navigateByUrl(['/login'])

#### Route Guard Processing > canActivate

canDeactivate > canLoad > canactivateChild > canActivate > resolvers

guard can be added to every route (or) adding a guard to parent guard will guard all its child routes

angular CLI> ng g g auth

since resolved run after route guard, we can't share data from resolver like> route.data['product'].so store the redirecturl in authservice then use that url

canActivate Guard will not reexecute only if child route changes.

#### canActivateChild Guard > similar to canActivate guard. not implemented in code

used to limit child routes

it is called when url changes to child route.canActivateChild Guard will not reexecute only if child route changes.

#### canDeactivateChild Guard

checks criteria before leaving route

used to:check for unsaved changes, confirm leaving an incomplete operation

it is executed when url changes to different route even if the only difference is route parameters.

it won't work if the user trys to navigate to entirely different website or closes the browser.

#### lazy loading of product module

###### requirements for lazy load

the feature area to lazy load must be defined in its own feature module because lazy loading loads all of the components declared in one specific angular module.

routes are grouped under a single parent route because lazy loading is configured on the parent route path.the module for that path is then loaded asynchronously.

feature module must not be imported in any other angular module.

#### canLoad Guard

check criteria before loading asynchronous route

used for : prevent loading a route if the user cannot access it.

canActivate route guard can able ask for login to access the lazy loaded module but it will load the module first then ask for login not vice versa.

#### preloading (Eager lazy loading)

lazy loading get the lazy load module only if the user requests.But preloading gets the preload modules in the background immediately after launching application main page.

#### preloading stategies

no preloading (default)(used canLoad Guard) > lazy load feature modules are loaded on demand when user navigates to route that configured for lazy loading

preload all (used canActivate guard)> preloads all lazy load feature modules

customs (used canActivate guard)> own preload strategy(control which modules preload when)

###### canLoad guard blocks preloading

so change canLoad guard to canActivate Guard when preload

#### custom preload strategy

1.Build a preloading strategy service

2.set the preloading strategy routing option

--refer "Angular router" by victor savkin :: https://leanpub.com/router
