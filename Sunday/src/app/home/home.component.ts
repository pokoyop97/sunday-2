import { Component, OnInit } from "@angular/core";
import * as AOS from "aos";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  nombre= "Sunday";
  constructor() {}

  ngOnInit() {
    AOS.init({
      delay: 200
    });
  }
}
