#include <Servo.h>

int sensorPin = A0;    // select the input pin for the potentiometer
int ledPin = 11;      // select the pin for the LED
int sensorValue = 0;  // variable to store the value coming from the sensor

int armPin = A4;
int val;
int hold_flag = 0;
Servo myservo;

int audioPin = A5;
int audioVal;

int ledPin2 = 10;

void setup() {
  // declare the ledPin as an OUTPUT:
  Serial.begin(9600);
  myservo.attach(5);
  myservo.write(45);
  pinMode(ledPin, OUTPUT);
  pinMode(ledPin2, OUTPUT);
}

void loop() {
  // nose and eye
  sensorValue = analogRead(sensorPin);
  sensorValue = map(sensorValue, 0, 1023, 0, 255);
  // turn the ledPin on
  analogWrite(ledPin, sensorValue);

  // servo motor
  val = analogRead(armPin);
  
  if (val >= 128) {
    hold_flag = 1;
  } else if (hold_flag == 1) {
    hold_flag = 0;
    delay(50);
    myservo.write(135);
    delay(500);
    myservo.write(45);
  }

  // sound sensor
  audioVal = analogRead(audioPin);
  if (audioVal >= 41) {
    Serial.println(audioVal);
    digitalWrite(ledPin2, HIGH);
    delay(200);
  } else {
    digitalWrite(ledPin2, LOW);
  }
}
