/*
  REAR WINDOW CAMERA PERIPHERAL
  Chip Limeburner

  This is code to run off an arduino microprocessor that provides the functionality for a tangible camera accesory. 
  The controller takes six inputs, 4-directional buttons, a "capture" button, and a photoresistor to detect when the 
  camera is held up in front of the face. 
*/

//assign pins for the buttons
const int upPin = 2;
const int downPin = 3;
const int leftPin = 4;
const int rightPin = 5;
const int snapPin = 6;

int up = 0; //binary indicator of up button being pressed
int down = 0; //binary indicator of down button being pressed
int left = 0; //binary indicator of left button being pressed
int right = 0; //binary indicator of right button being pressed
int snap = 0; //binary indicator of snap button being pressed

int sensorValue; //the raw analog value from the photoresistor

int sensorHigh = 0; //binary representation of if the photoresistor is "high" or "low" based on an experimentally determined cutoff

int serialOutputByte = 0; //variable to store the byte to send to the server


// setup()
// function that initializes and starts the material we'll need in the main loop.
void setup() {
  Serial.begin(9600); //start the serial output

  //initialize button pins
  pinMode(upPin, INPUT);
  pinMode(downPin, INPUT);
  pinMode(leftPin, INPUT);
  pinMode(rightPin, INPUT);
  pinMode(snapPin, INPUT);
}


// loop()
// function that will loop endlessless. Pulls our input data and formats it to be passed to the server.
void loop() {
  //read the button pin values
  up = !digitalRead(upPin);
  down = !digitalRead(downPin);
  left = !digitalRead(leftPin);
  right = !digitalRead(rightPin);
  snap = !digitalRead(snapPin);

  sensorValue = analogRead(A0); //read the analog value from the photoresistor

  //translate the analog photoresistor value to a digital one
  if (sensorValue > 600) {
    sensorHigh = 1;
  } else {
    sensorHigh = 0;
  }

  serialOutputByte = (1*up) + (2*down) + (4*left) + (8*right) + (16*sensorHigh) + (32*snap); //convert all our binary values to a passable byte

  Serial.write(serialOutputByte); //output byte
  
  delay(10); //wait a bit
}
