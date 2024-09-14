const axios=require('axios');
const cheerio= require('cheerio');

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
        console.log(obj)
        return obj;
    }
    catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        return null;
    }
}

const generateQRCodeLink = (text, size) => {
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}&size=${size}x${size}`;
    return apiUrl;
  };

  console.log(generateQRCodeLink('https://i95muscle.com/1959-chevrolet-bel-air-sport-coupe-348-hope-mills-nc-28348/7337313', 200));

retrieveInfo('https://i95muscle.com/1959-chevrolet-bel-air-sport-coupe-348-hope-mills-nc-28348/7337313');