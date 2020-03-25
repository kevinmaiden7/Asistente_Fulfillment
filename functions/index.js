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
    Suggestions
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

// List of available insurance carriers
const insuranceCarriers = ['Sura', 'Allianz', 'Solidaria', 'Mapfre', 'Liberty'];

// Handle the Dialogflow intent named 'id'.
// The intent collects a parameter named 'number'.
app.intent('id', (conv, {number}) => {
    conv.data.id = number;
    conv.ask('Gracias '+ conv.data.name +', he recibido tu identificación. ' + 
    '¿A cuál compañía aseguradora estás afiliado?');
    conv.ask(new Suggestions(insuranceCarriers));
});

// Handle the Dialogflow intent named 'aseguradora'.
// The intent collects a parameter named 'insuranceCarrier'.
app.intent('aseguradora', (conv, {insuranceCarrier}) => {
  conv.data.aseguradora = insuranceCarrier;
  conv.ask('He registrado tu aseguradora: ' + conv.data.aseguradora +
  '. Ahora necesito una información más detallada del vehículo. ' + 
  '¿Cuál es la placa?');
});

// Handle the Dialogflow intent named 'placa'.
// The intent collects a parameter named 'any'.
app.intent('placa', (conv, {any}) => {
    conv.data.placa = any;
    conv.ask('He registrado tu placa: ' + conv.data.placa +
    ', ¿Cuál es el tipo de vehículo?');
  });

app.intent('tipo', (conv, {any}) => {
    conv.data.tipo = any;
    conv.ask('He registrado el tipo: ' + conv.data.tipo +
    ', ¿De qué color es el vehículo?');
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
