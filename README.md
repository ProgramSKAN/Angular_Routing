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
