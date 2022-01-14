const puppeteer = require('puppeteer');
const xlsx=require('xlsx');
const url = 'https://in.indeed.com/';

// const city = 'Ludhiana, Punjab';
// const job = 'Web developer';

 

let jobDataExtracter=async (job,city) => {
    try {
        const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.goto(url);
        await page.waitForSelector('input[type="text"]', { visible: true });
        await page.type('.icl-TextInput #text-input-what', job);
        await page.type('.icl-TextInput #text-input-where', city);
        await page.click(' button[type="submit"]');

        let nextUrl = true

        let totalData=[];
        while (nextUrl) {
            try{
                await page.waitForSelector('.pagination');
                nextUrl = await getNextUrl()
            }catch(err){
                nextUrl=null
            }
           
            totalData=totalData.concat(await extractData())
            if(nextUrl){
                await page.goto(nextUrl);
            }
        }

        function getNextUrl() {
            return  page.evaluate(() => {
                const list = document.querySelectorAll('.pagination .pagination-list a');
                if (list[list.length - 1].getAttribute('aria-label') == 'Next') {
                    let tempUrl = list[list.length - 1].getAttribute('href');
                    return `https://in.indeed.com${tempUrl}`;
                } else {
                    return null;
                }
            })
        }

        async function extractData() {
            await page.waitForSelector('#mosaic-provider-jobcards .tapItem');
            let arr = await page.evaluate(() => {

                const cards = document.querySelectorAll('#mosaic-provider-jobcards .tapItem');
                let resultArr = [];
                for (let i = 0; i < cards.length; i++) {

                    const JobTitle = cards[i].querySelector('span[title]').innerText;

                    const Company = cards[i].querySelector('.companyName').innerText;

                    let location= cards[i].querySelector('.companyLocation').innerText;
                    
                    const Location =location.split('\n')[0];

                    const Salary = cards[i].querySelector('.salary-snippet') ? cards[i].querySelector('.salary-snippet').innerText : '';

                    const Summery = cards[i].querySelector('.job-snippet').innerText;

                    let date=cards[i].querySelector('.date').innerText;
                    
                    const PostDate=date.split('\n')[1] ;
                    const ExtractDate= new Date().toISOString().slice(0, 10);

                    const JobUrl = `https://in.indeed.com${cards[i].getAttribute('href')}`;

                    resultArr.push({ JobTitle, Company, Location, Salary, Summery, PostDate,ExtractDate, JobUrl });
                }
                return resultArr;
            })

            return arr;
        }

        console.log("Data is Extracted ")
        

        let newWb=xlsx.utils.book_new();
        let newWs=xlsx.utils.json_to_sheet(totalData);

        xlsx.utils.book_append_sheet(newWb,newWs,'JobData');
        xlsx.writeFile(newWb,'jobData.xlsx');

        console.log("Data is Saved to Excel File");

        
    
        await browser.close();
        return {
            status:1,
            path:__dirname
        }

    } catch (err) {
        console.log(err);
        return {
            status:0,
            path:null
        }
    }
}



module.exports= jobDataExtracter;