//
'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const { dialogflow, Suggestions} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// List of available insurance carriers
const insuranceCarriers = ['Sura', 'Allianz', 'Solidaria', 'Mapfre', 'Liberty'];

// List of most common colors
const colors = ['rojo', 'azul', 'blanco', 'negro', 'gris'];

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

// Handle the Dialogflow intent named 'tipo'.
// The intent collects a parameter named 'any'.
app.intent('tipo', (conv, {any}) => {
    conv.data.tipo = any;
    conv.ask('He registrado el tipo: ' + conv.data.tipo +
    ', ¿De qué color es el vehículo?');
    conv.ask(new Suggestions(colors));
});

// Handle the Dialogflow intent named 'color'.
// The intent collects a parameter named 'color'.
app.intent('color', (conv, {color}) => {
    conv.data.color = color;
    conv.ask('He registrado el color de tu vehículo como: ' + conv.data.color + '. Ahora, ¿Cuál es la marca?');
});

// Handle the Dialogflow intent named 'marca'.
// The intent collects a parameter named 'any'.
app.intent('marca', (conv, {any}) => {
    conv.data.marca = any;
    conv.ask('Fue reportada la marca de tu vehículo como: ' + conv.data.marca + '.' +
    'Ahora, ¿Cuál es el modelo de tu vehículo?');
});

// Handle the Dialogflow intent named 'modelo'.
// The intent collects a parameter named 'any'.
app.intent('modelo', (conv, {any}) => {
    conv.data.modelo = any;
    conv.ask('El modelo de tu vehículo es: ' + conv.data.modelo + '.' +
    ' Ahora, ¿De qué año es el vehículo?');
});

// Handle the Dialogflow intent named 'year'.
// The intent collects a parameter named 'number'.
app.intent('year', (conv, {number}) => {
    conv.data.year = number;
    conv.close('El año de tu vehículo es ' + conv.data.year +
    ' Hemos completado las preguntas; tu reporte será generado. Recuerda que tomar fotos de la escena te será de gran ayuda, igual que tomar datos de contacto de personas involucradas.'
    +' Hasta luego!');
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
