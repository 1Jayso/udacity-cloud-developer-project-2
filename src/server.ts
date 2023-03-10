import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { Router, Request, Response } from "express";


(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  // app.use(bodyParser.json());

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res: Response ) => {
        res.send("try GET /filteredimage?image_url={{}}"); 
  } );


  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT

  const authHeader = 'Ocp-Apim-Subscription-Key';

  // middleware function to check for the auth header
  function checkAuth(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.header(authHeader);
    if (!apiKey) {
      return res.status(401).send('Unauthorized');
    }
    // check the value of the api key
    if (apiKey !== 'abc123') {
      return res.status(401).send('Invalid API key');
    }
    next();
  }
  


  app.use(checkAuth);
 app.get('/filteredimage', async (req: Request, res: Response) =>
  {
    const img_url = req.query.image_url.toString();
    if (!img_url) {
      res.status(400).send('require image url');
    }
    const filter_img = await filterImageFromURL(img_url);
    res.status(200).sendFile(filter_img, {
      headers: {
        'Content-Type': 'image/jpeg'
      }
    },() =>
    {
      deleteLocalFiles([filter_img]);
    });
  });
  //! END @TODO1
  

  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();