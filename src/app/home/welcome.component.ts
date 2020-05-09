import { Component } from "@angular/core";

@Component({
  //selector: 'pm-home',//not required since we are using route to get to this page and not using any nested components
  templateUrl: "./welcome.component.html",
})
export class WelcomeComponent {
  public pageTitle = "Welcome";
}
