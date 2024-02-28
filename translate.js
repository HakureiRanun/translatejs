require('chromedriver');
//导入chrome浏览器驱动
const { Builder, By, } = require('selenium-webdriver');
const chrome = require("selenium-webdriver/chrome");
const fs = require('fs');
let txt = fs.readFileSync('./word.json','utf-8');
let word = JSON.parse(txt);
let result = [null];
let key = 'name';
let options = new chrome.Options();
options.addArguments('--ignore-certificate-errors');
options.addArguments('--ignore -ssl-errors');
const driver = new Builder().forBrowser('chrome').setChromeOptions(options).build();


async function baidufanyi(){
    await driver.get('https://fanyi.baidu.com/#jp/zh/');
    await driver.sleep(3000);
    loop();  
}

async function loop(){
    if(word[result.length][key]!=''){
        console.log(word[result.length][key]);
        // driver.findElement(By.id('baidu_translate_input')).clear();
        // driver.findElement(By.id('baidu_translate_input')).sendKeys(word[result.length][key]);
        // driver.findElement(By.id('translate-button')).click();
        await driver.get('https://fanyi.baidu.com/#jp/zh/'+word[result.length][key]);
        await driver.sleep(7000);
        let resultStr = '';
        let results = await driver.findElements(By.className('target-output'));
        for(let i in results){
            resultStr += (await results[i].getAttribute('innerText')).toString();
        }
        word[result.length][key] = resultStr;
        result.push(resultStr);
        console.log(resultStr);
    }else{
        result.push('');
    }
    console.log(result.length+'/'+word.length);
    if(result.length!=word.length){
        loop();
    }else{
        fs.writeFileSync('./tmp.json',JSON.stringify(word),'utf-8');
        driver.quit();
    }
}

baidufanyi();