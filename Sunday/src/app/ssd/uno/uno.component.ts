import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-uno",
  templateUrl: "./uno.component.html",
  styleUrls: ["./uno.component.css"]
})
export class UnoComponent implements OnInit {
  public show1:boolean = true;
  public show2:boolean = false;
  public show3:boolean = false;
  public show4:boolean = false;
  public show5:boolean = false;
  public show6:boolean = false;
  public show7:boolean = false;
  public show8:boolean = false;
  public show9:boolean = false;
  public show10:boolean = false;
  public dietMusculo = false;
  public diet = false;
  public dietCardio = false;
  public masa:string;
  public estatura:string;
  public dieta:number=0;/*si es 1 entonces lleva dieta si es 0 entonces no lleva dieta */
  public planes:string="";
  public puntaje:number=0;/* auxiliar para contar los puntos para elegir la dieta y el plan a seguir */
  public cardiaco:number=0; /* si es 1 entonces es cardiaco y solo seguira dieta si es 0 entonces podra hacer cardio */
  public plan: number=0; /* si es 0 y en cardiaco es 0 solo seguira dieta,
  si es 0 (bajar de peso) y en cardiaco es 1 podra hacer cardio, 
  si es 1 (ganar musculos) y en cardiaco es 1 podra hacer pesas*/
  /*rutinas*/
  public dietas:any  = [{
    desayuno: "Desayuno",
    pollo: "250g",
    arroz: "300g",
    nueces: "40g",
  },
  {
    comida: "Comida",
    pollo: "250g",
    arroz: "300g",
    nueces: "40g",
  },
  {
    cena: "Cena",
    pollo: "250g",
    arroz: "300g",
    nueces: "40g",
  }]
  public dietaCardio:any  = [{
    desayuno: "Desayuno",
    pollo: "200g",
    arroz: "300g",
    nueces: "40g",
  },
  {
    comida: "Comida",
    pollo: "200g",
    arroz: "300g",
    nueces: "40g",
  },
  {
    cena: "Cena",
    pollo: "200g",
    arroz: "300g",
    nueces: "40g",
  }]
  
  public dietaMusculo:any  = [{
    desayuno: "Desayuno",
    pollo: "350g",
    arroz: "300g",
    nueces: "40g",
  },
  {
    comida: "Comida",
    pollo: "350g",
    arroz: "300g",
    nueces: "40g",
  },
  {
    cena: "Cena",
    pollo: "350g",
    arroz: "300g",
    nueces: "40g",
  }]

  uno1(){
    this.show1 = !this.show1;
    this.show2 = !this.show2;
    this.puntaje = this.puntaje + 0;
  } 
  uno2(){
    this.show1 = !this.show1;
    this.show3 = !this.show3;
    this.puntaje = this.puntaje + 5;
  }
  dos1(){
    this.show2 = !this.show2;
    this.show3 = !this.show3;
    this.puntaje = this.puntaje + 5;
  }
  dos2(){
    this.show2 = !this.show2;
    this.show4 = !this.show4;
    this.puntaje = this.puntaje + 0;
  }
  tres1(){
    this.show3 = !this.show3;
    this.show4 = !this.show4;
    this.puntaje = this.puntaje + 15;
  }
  tres2(){
    this.show3 = !this.show3;
    this.show4 = !this.show4;
    this.puntaje = this.puntaje + 0;
  }
  cuatro1(){
    this.show4 = !this.show4;
    this.show5 = !this.show5;
    this.plan=0;
    this.puntaje = this.puntaje + 2;
  }
  cuatro2(){
    this.show4 = !this.show4;
    this.show6 = !this.show6;
    this.plan= 1;
    this.puntaje = this.puntaje + 8;
  }
  cinco1(){
    this.show5 = !this.show5;
    this.show7 = !this.show7;
    this.puntaje = this.puntaje + 0;
  }
  cinco2(){
    this.show5 = !this.show5;
    this.show6 = !this.show6;
    this.puntaje = this.puntaje + 7;
  }
  seis1(){
    this.show6 = !this.show6;
    this.show8 = !this.show8;
    this.puntaje = this.puntaje + 20;
    this.dieta = 1;
    this.seleccion();
  }
  seis2(){
    this.show6 = !this.show6;
    this.show8 = !this.show8;
    this.puntaje = this.puntaje + 0;
    this.dieta = 0;
    this.seleccion();
  }
  siete1(){
    this.show7 = !this.show7;
    this.show8 = !this.show8;
    this.cardiaco= 1;
    this.puntaje = this.puntaje + 0;
    this.seleccion();
  }
  siete2(){
    this.show7 = !this.show7;
    this.show6 = !this.show6;
    this.puntaje = this.puntaje + 6;
    this.seleccion();
  }
  ocho1(){
    this.show8 = !this.show8;
    this.show9 = !this.show9;
  }
  nueve1(peso: string, estatura: string){
    this.show9 = !this.show9;
    this.show10 = !this.show10;
    this.masa = peso;
    this.estatura = estatura;
  }

  seleccion(){
    if(this.cardiaco == 1){
      this.planes = "Se utilizara un plan de solo dieta por motivos de salud"
      this.diet = !this.diet;
    }
    if( this.cardiaco == 0 && this.plan == 0 && this.dieta == 1){
      this.planes = "Se utilizara un plan de dieta y cardio"
      this.dietCardio = !this.dietCardio;
    }
    if (this.cardiaco == 0 && this.plan == 1 && this.dieta == 0){
      this.planes = "Se utilizara un plan de rutinas con peso pero sin dieta"
      this.dietMusculo = !this.dietMusculo;
    }
    if (this.cardiaco == 0 && this.plan == 1 && this.dieta == 1){
      this.planes = "Se utilizara un plan de dieta y rutinas con peso"
      this.dietMusculo = !this.dietMusculo;
    }
    if (this.cardiaco == 0 && this.plan == 0 && this.dieta == 0){
      this.planes = "Se utilizara un plan de cardio sin dieta";
      this.dietCardio = !this.dietCardio;
    }
  }
  constructor(private router: Router) {}

  ngOnInit() {
  }
}
