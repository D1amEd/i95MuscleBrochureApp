const axios=require('axios');
const cheerio= require('cheerio');
const express= require('express');


const app = express();

app.use(express.urlencoded({ extended: true })); // Replaces bodyParser.urlencoded



// Set EJS as the template engine
app.set('view engine', 'Ejs');
app.use('/imgs', express.static('imgs'));

async function retrieveInfo(url) {
    try{
        // Fetch the HTML from the given URL
        const { data } = await axios.get(url);

        // Load the HTML into Cheerio for parsing
        const $ = cheerio.load(data);
        
        // Extract the page's title
        const h1Tags = [];
        $('h1').each((index, element) => {
            h1Tags.push($(element).text());
        });

         // Extract the image src inside the #main_image section
        const mainImageSrc = $('#main_image img').attr('src');

         // Extract "Our Price" from the span inside h3 with class "website_price"
         const ourPrice = $('h3.website_price span').text();

         // Extract "Retail Value" from the strike inside h3 with class "secondary_price"
         const retailValue = $('h3.secondary_price strike').text();

        // Select both paragraphs inside the section with id "vehicle_description"
        const paragraphs = $('#vehicle_description p').map((index, element) => $(element).text()).get();

        // Join the two paragraphs into one string
        const joinedParagraphs = paragraphs.join('\n');

         // Extract values and store them in variables
         const exterior = $('dd.exterior_value').text();
         const interior = $('dd.interior_value').text();
         const engine = $('dd.engine_value').text();
         const transmission = $('dd.transmission_value').text();
         const drivetrain = $('dd.drivetrain_value').text();
         const mileage = $('dd.mileage_value').text();
         const vin = $('dd.vin_value').text();
         const warranty = $('dd.warranty_value').text();
         const stock = $('dd.stock_value').text();

        const watchvideo = $('#watch_video').attr('href');

        const obj={
            title: h1Tags[0],
            mainImageSrc,
            ourPrice,
            retailValue,
            description: joinedParagraphs,
            exterior,
            interior,
            engine,
            transmission,
            drivetrain,
            mileage,
            vin,
            warranty,
            stock
        }
        if(watchvideo){
            obj.watchvideo=watchvideo
        }
        return obj;
    }
    catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        return null;
    }
}



// Main Page to accept URL input
app.get('/', (req, res) => {
    res.render('main'); // Renders the form page for URL input
});


// Handle form submission and scrape vehicle data
app.post('/scrape', async (req, res) => {
    const url = req.body.url; // Get the URL from the form submission
    const vehicleData = await retrieveInfo(url); // Fetch vehicle data

    // If scraping succeeds, render the index page with the vehicle data
    if (vehicleData) {
        const qrCodeLink = generateQRCodeLink(url, 500);
        if (vehicleData.watchvideo) {
            vehicleData.watchvideo = generateQRCodeLink(vehicleData.watchvideo, 500);
        }
        vehicleData.qrCodeLink = qrCodeLink;
        res.render('index', { vehicle: vehicleData });
    } else {
        res.send('Failed to retrieve vehicle data.');
    }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

const generateQRCodeLink = (text, size) => {
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}&size=${"800"}x${"800"}`;
    return apiUrl;
  };
