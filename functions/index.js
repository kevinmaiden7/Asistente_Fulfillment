// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
    dialogflow,
    Suggestions,
    Carousel,
    Image
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// Handle the Dialogflow default initial intent.
app.intent('Default Welcome Intent', (conv) => {
    conv.ask('Te has conectado al servicio de reporte de incidentes para tu aseguradora. ' +
    'Antes que nada, ¿hay personas heridas?');
    conv.ask(new Suggestions('Si', 'No'));
});

// Handle the Dialogflow intent named 'heridos - no'.
app.intent('heridos - no', (conv) => {
    conv.ask('Perfecto, procedamos con unas preguntas. ' + 
    '¿Cuál es tu nombre completo?');
});

// Handle the Dialogflow intent named 'nombre'.
// The intent collects a parameter named 'person'.
app.intent('nombre', (conv, {person}) => {
    var completeName = "";
    for (const item of person){
        completeName = completeName + ' ' + item.name;
    }
    conv.data.name = completeName;
    conv.ask('Gracias ' + completeName + ', he recibido tu nombre. ' +
    '¿Cuál es tu número de identificación?');
});

// Handle the Dialogflow intent named 'id'.
// The intent collects a parameter named 'number'.
app.intent('id', (conv, {number}) => {
    conv.data.id = number;
    conv.ask('Gracias '+ conv.data.name +', he recibido tu identificación. ' + 
    '¿A cuál compañía aseguradora estás afiliado?');
    // If the user is using a screened device, display the carousel
    if (conv.screen) return conv.ask(insuranceCarousel());
});

// Handle the Dialogflow intent named 'aseguradora'.
// The intent collects a parameter named 'insuranceCarrier'.
app.intent('aseguradora', (conv, {insuranceCarrier}) => {
    insuranceCarrier = conv.arguments.get('OPTION') || insuranceCarrier;
    conv.data.aseguradora = insuranceCarrier;
    conv.ask('Gracias '+ conv.data.name +', he registrado tu aseguradora: ' + conv.data.aseguradora +
    '. Ahora necesito una información más detallada del vehículo. ' + 
    '¿Cuál es la placa?');
});

// In the case the user is interacting with the Action on a screened device
// The Insurance Carousel will display a carousel of insurance carriers
const insuranceCarousel = () => {
    const carousel = new Carousel({
     items: {
       'suramericana': {
         title: 'Suramericana',
         synonyms: ['grupo sura', 'seguros generales suramericana', 'sura'],
         image: new Image({
           url: 'https://www.sura.com/rsa/assets/img/sura-logo.png',
           alt: 'suramericana',
         }),
       },
       'allianz': {
         title: 'Allianz',
         synonyms: ['allianz seguros', 'allianz colombia'],
         image: new Image({
           url: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Allianz.png',
           alt: 'allianz',
         }),
       },
       'solidaria': {
        title: 'Solidaria',
        synonyms: ['aseguradora solidaria', 'aseguradora solidaria de colombia'],
        image: new Image({
          url: 'https://gestionsolidaria.com/wp-content/uploads/2019/05/Aseguradora-Solidaria-.png',
          alt: 'solidaria',
        }),
      },
      'mapfre': {
        title: 'Mapfre',
        synonyms: ['mapfre seguros', 'mapfre seguros generales de colombia'],
        image: new Image({
          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Mapfre_logo.svg/1200px-Mapfre_logo.svg.png',
          alt: 'mapfre',
        }),
      },
      'liberty': {
        title: 'Liberty',
        synonyms: ['liberty seguros', 'liberty seguros colombia'],
        image: new Image({
          url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/LogotipoLiberty.jpg',
          alt: 'liberty',
        }),
      },
   }});
   return carousel;
  };

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
