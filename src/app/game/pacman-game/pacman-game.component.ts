import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {PopupDialogComponent} from "../../popup/popup-dialog/popup-dialog.component";
import {Router} from "@angular/router";
import {FirebaseService} from "../../services/firebase.service";
import {Pacman} from "../../models/Pocman";

@Component({
  selector: 'app-pacman-game',
  templateUrl: './pacman-game.component.html',
  styleUrls: ['./pacman-game.component.css']
})

export class PacmanGameComponent implements OnInit {

  // create a variable with type CanvasRenderingContext2D for drawing 2D graphics on canvas.
  cCtx!: CanvasRenderingContext2D;
  // Creating a new Instance of Image class which can be used as a source for drawing on the canvas
  spriteImage = new Image();

  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;

  // Set the default value for the radius of an element.
  elRadius = 1;

  // Set the default value for the width and thick of the boundary.
  chrBoundaryWide = 8;
  chrBoundaryThick = 8;

  //Key Events
  arrayLeft = 37;
  arrayUp = 38;
  arrayRight = 39;
  arrayDown = 40;

  totalScore = 0;
  username = '';
  gameOver: boolean = false;

  // Get a reference to the canvas element with the ID 'canvasPacman' in component's template
  // and store it in the 'canvasRef' property.
  @ViewChild('canvasPacman', {static: true}) canvasRef!: ElementRef;

  // Create a new Pacman object with an initial position of (300, 300),
  // initial velocity of (0, 0), a pressedKey value of -1 (indicating no key has been pressed),
  pacman = new Pacman({
    position: {
      x: 300,
      y: 300,
    },
    velocity: {
      x: 0,
      y: 0,
    },
    // any other key except arrows
    //it will have the effect of stopping the pacman
    pressedKey: -1,
    radius: this.elRadius,
  });
  imageData!: ImageData;

  contours: {
    [key: number]: number[];
  } = {};

  @ViewChild('modal') modal!: PopupDialogComponent;

  constructor( private router: Router,
               private firebaseService: FirebaseService) {
    this.spriteImage.src = 'assets/media/png/sprite-sheet.png';
    if (this.canvasWidth > this.canvasHeight) {
      this.canvasWidth = this.canvasHeight;
    } else {
      this.canvasHeight = this.canvasWidth;
    }
  }

// Listen for the 'keydown' event on the 'window' object and call the 'OnKeyDown' function.
  @HostListener('window:keydown', ['$event']) OnKeyDown(event: any) {
    // Set the 'pressedKey' property of the 'pacman' object to the key code of the pressed key.
    this.pacman.pressedKey = event['keyCode'];
  }

// Listen for the 'keyup' event on the 'window' object and call the 'OnKeyUp' function.
  @HostListener('window:keyup', ['$event']) OnKeyUp(event: any) {
    // Set the 'pressedKey' property of the 'pacman' object to -1 (indicating no key is pressed).
    this.pacman.pressedKey = -1;
  }

  ngOnInit() {

    // Get a reference to the 2D rendering context of the canvas element
    this.cCtx = this.canvasRef.nativeElement.getContext('2d');

    // Set the width and height of the canvas element to match the size of the browser window.
    this.canvasRef.nativeElement.width = this.canvasWidth;
    this.canvasRef.nativeElement.height = this.canvasHeight;

    // Calculate the radius of an element based on the width of the canvas.
    this.elRadius = Math.floor(this.canvasWidth * 0.017);

    // Set the radius of the 'pacman' object to match the calculated element radius.
    this.pacman.radius = this.elRadius;

    // Calculate the width of the boundary around each character based on the 'pacman' radius.
    this.chrBoundaryWide = Math.floor(this.pacman.radius * 0.8);

    this.modifyImage();
    this.animate();

    if (this.gameOver){
      this.showModal();
    }
  }


  // This method loads an image onto a canvas,
  // modifies the image data to filter out certain colors,
  // and creates contours based on the modified image data.
  modifyImage() {

    //onload  waits for the image to load before executing the code within its block
    this.spriteImage.onload = () => {

      // draws the sprite-sheet image onto the canvas with the specified dimensions and coordinates
      this.cCtx.drawImage(
        this.spriteImage,
        0,
        0,
        225,
        250,
        this.canvasWidth * 0.2,
        this.canvasWidth * 0.2,
        this.canvasWidth * 0.6,
        this.canvasWidth * 0.6
      );

      // gets the pixel data of the entire canvas and stores it in an ImageData object
      this.imageData = this.cCtx.getImageData(
        0,
        0,
        this.canvasWidth,
        this.canvasHeight
      );

      //  iterates through each pixel in the canvas and checks its RGB values
      //  to determine whether it should be modified or not
      for (let i = 0; i < this.imageData.data.length; i += 4) {
        let r = this.imageData.data[i];
        let g = this.imageData.data[i + 1];
        let b = this.imageData.data[i + 2];
        //checks whether the blue value of a pixel is significantly higher than its red and green values,
        // and whether the difference between the blue and red/green values is greater than 20.
        // If these conditions are met, the pixel is considered part of the contour and is set to white.
        // Otherwise, the pixel is set to black.
        if (b > r && b > g && b - r > 20 && b - g > 20) {
          this.imageData.data[i] = 255;
          this.imageData.data[i + 1] = 255;
          this.imageData.data[i + 2] = 255;
        } else {
          this.imageData.data[i] = 0;
          this.imageData.data[i + 1] = 0;
          this.imageData.data[i + 2] = 0;
        }
      }

      // iterates through each column of pixels in the canvas and
      // creates a new entry in the this.contours dictionary for each column.
      for (let x = 0; x < this.canvasWidth; x += 2) {
        this.contours[x] = [];
        for (let y = 0; y < this.canvasWidth; y += 4) {
          // calculates the index of the current pixel in the imageData array based on its (x, y) coordinates
          let i = (y * this.canvasWidth + x) * 4;
          // checks whether the current pixel is white (part of a contour).
          // If it is, its y-coordinate is added to the array stored in the this.contours[x] entry for the current column.
          if (this.imageData.data[i] === 255) {
            this.contours[x].push(y);
          }
        }
      }

      // iterates through each column in the this.contours dictionary and each y-coordinate stored in its array,
      // and draws a pink point on the canvas at each (x, y) coordinate.
      Object.keys(this.contours).forEach((x) => {
        this.contours[+x].forEach((y) => {
          this.drawPoint(+x, y, 'pink');
        });
      });

      // this.cCtx.putImageData(this.imageData, 0, 0);
    };
  }

  // This method is responsible for animating the game.
  animate() {

    // this method call itself recursively by creating an infinite loop of rendering
    requestAnimationFrame(() => this.animate());

    // Clear the canvas before drawing new objects
    this.cCtx.clearRect(0, 0, this.canvasWidth * 0.6, this.canvasWidth * 0.6);

    // Draw the sprite image on the canvas
    this.cCtx.drawImage(
      this.spriteImage,
      0,
      0,
      225,
      250,
      this.canvasWidth * 0.2,
      this.canvasWidth * 0.2,
      this.canvasWidth * 0.6,
      this.canvasWidth * 0.6
    );

    // Based on the pressed key, update the pacman's velocity
    switch (this.pacman.pressedKey) {
      case this.arrayLeft:
        if (this.collisionXDetection(-1, -1)) {
          this.pacman.velocity.x = 0;
        } else {
          this.pacman.velocity.x = -5;
        }
        break;
      case this.arrayUp:
        if (this.collisionYDetection(-1, -1)) {
          this.pacman.velocity.y = 0;
        } else {
          this.pacman.velocity.y = -5;
        }
        break;
      case this.arrayRight:
        if (this.collisionXDetection(1, 1)) {
          this.pacman.velocity.x = 0;
        } else {
          this.pacman.velocity.x = 5;
        }
        break;
      case this.arrayDown:
        if (this.collisionYDetection(1, 1)) {
          this.pacman.velocity.y = 0;
        } else {
          this.pacman.velocity.y = 5;
        }
        break;
      default:
        this.pacman.velocity.x = 0;
        this.pacman.velocity.y = 0;
        break;
    }

    this.pacman.update(this.cCtx);
  }

  // This method checks for collision detection in the horizontal (X) direction
  collisionXDetection(radiusSign: -1 | 1, boundarySign: -1 | 1): boolean {
    let collided = false;

    // checks if there is any collision by looping through the width of the boundary
    for (let i = 1; i < this.chrBoundaryThick; i++) {
      if (collided) {
        return true;
      }

      // For each thickness, it checks if there is any collision by looping through the width of the boundary
      for (let j = -this.chrBoundaryWide; j < this.chrBoundaryWide; j++) {
        const radius = radiusSign * this.pacman.radius;
        const boundarySize = i * boundarySign;
        this.drawPoint(
          this.pacman.position.x + radius + boundarySize,
          this.pacman.position.y + j,
          'red'
        );
        if (
          this.contours[this.pacman.position.x + radius + boundarySize] &&
          this.contours[this.pacman.position.x + radius + boundarySize].indexOf(
            this.pacman.position.y + j
          ) > -1
        ) {
          collided = true;
          break;
        }
      }
    }
    return false;
  }

  // This method checks for collision detection in the horizontal (Y) direction
  collisionYDetection(radiusSign: -1 | 1, boundarySign: -1 | 1): boolean {
    let found = false;
    // checks if there is any collision by looping through the width of the boundary
    for (let i = 1; i < this.chrBoundaryThick; i++) {
      if (found) {
        return true;
      }

      // For each thickness, it checks if there is any collision by looping through the width of the boundary
      for (let j = -this.chrBoundaryWide; j < this.chrBoundaryWide; j++) {
        const radius = radiusSign * this.pacman.radius;
        const boundarySize = i * boundarySign;
        this.drawPoint(
          this.pacman.position.x + j,
          this.pacman.position.y + radius + boundarySize,
          'red'
        );

        if (
          this.contours[this.pacman.position.x + j] &&
          this.contours[this.pacman.position.x + j].indexOf(
            this.pacman.position.y + radius + boundarySize
          ) > -1
        ) {
          const ind = this.contours[this.pacman.position.x + j].indexOf(
            this.pacman.position.y + radius + boundarySize
          );

          found = true;
          break;
        }
      }
    }
    return false;
  }

  drawPoint(x: number, y: number, color: string) {
    this.cCtx.beginPath();
    this.cCtx.arc(x, y, 2, 0, Math.PI * 2);
    this.cCtx.fillStyle = color;
    this.cCtx.fill();
    this.cCtx.closePath();
  }

  // update the score by adding points for any coin and big coin
  // scoreUpdate(step: any) {
  //   if (step == this.coin) {
  //     this.totalScore = this.totalScore + this.eatCoin;
  //   } else if (step == this.bigCoin) {
  //     this.totalScore = this.totalScore + this.eatBigCoin;
  //   }
  // }

  // Show the popup for enter username and save score in firebase
  showModal() {
    this.modal.show();
  }

  // Submit username and score value in firebase
  submit() {
    this.modal.hide();
    let id = Math.random().toString();
    this.router.navigate(['/'])
    this.firebaseService.addNewUser(id, this.username, this.totalScore)
  }
}


