const fs = require('fs');

fs.readFile('processedData.json', 'utf8', (err, data) => {
    const processedData = JSON.parse(data);
    let allWords = [], allsentences = [];
    processedData.forEach(el => {
        if(el.sentences){
            el.sentences.forEach(sentence => {
                allsentences.push(sentence);
                allWords = [...allWords, ...sentence.en.replace(/[,.?]/g, '').split(' ')];
            })
        } else {
            console.log('el.sentences null',el)
        }
    });

    const countMap = allWords.reduce((map, item) => {
        map[item] = (map[item] || 0) + 1;
        return map;
    }, {});
    const uniqueArray = Object.keys(countMap);
    
    processedData.forEach(item => {
        item.score = countMap[item.en];
        const regex = new RegExp(`\\b${item.en}\\b`, "gi");
        const targetSentence = allsentences.filter(el => el.en.match(regex));
        if (targetSentence) {
            item.sentences = [];
            item.sentences = [...targetSentence];
        }
    });

    const jsonData = JSON.stringify(processedData, null, 2);
    fs.writeFile('scoreData.json', jsonData, 'utf8', (err) => {
        if (err) {
            console.error('寫入檔案時發生錯誤：', err);
            return;
        }
        console.log('processedData 成功寫入檔案！',processedData.length);
    });

    const jsonUniqueArray = JSON.stringify(uniqueArray, null, 2);
    fs.writeFile('uniqueArray.json', jsonUniqueArray, 'utf8', (err) => {
        if (err) {
            console.error('寫入檔案時發生錯誤：', err);
            return;
        }
        console.log('uniqueArray 成功寫入檔案！',uniqueArray.length);
    });

    const jsonCountMap = JSON.stringify(countMap, null, 2);
    fs.writeFile('countMap.json', jsonCountMap, 'utf8', (err) => {
        if (err) {
            console.error('寫入檔案時發生錯誤：', err);
            return;
        }
        console.log('countMap 成功寫入檔案！',countMap.length);
    });
});