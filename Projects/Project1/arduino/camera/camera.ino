/*
  REAR WINDOW CAMERA PERIPHERAL
  Chip Limeburner

  This is code to run off an arduino microprocessor that provides the functionality for a tangible camera accesory. 
  The controller takes six inputs, 4-directional buttons, a "capture" button, and a photoresistor to detect when the 
  camera is held up in front of the face. 
*/


int sensorValue;

int sensorLow = 1023;

int sensorHigh = 0;


void setup() {
  Serial.begin(9600);


}


void loop() {
  sensorValue = analogRead(A0);

  Serial.println(sensorValue);

  delay(10);
}
