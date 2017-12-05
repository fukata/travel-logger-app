import { self } from 'react-native-workers';

/* get message from application. String only ! */
self.onmessage = (message) => {
  console.log("received message from app. message=%s", message);
}

/* post message to application. String only ! */
self.postMessage("hello from worker");