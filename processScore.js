const fs = require('fs');

fs.readFile('processedData.json', 'utf8', (err, data) => {
    const processedData = JSON.parse(data);
    let allWords = [], allsentences = [], allEn = [];
    processedData.forEach(el => {
        if (el.sentences) {
            allEn.push(el.en);
            el.sentences.forEach(sentence => {
                allsentences.push(sentence);
                allWords = [...allWords, ...sentence.en.replace(/[,.?]/g, '').split(' ')];
            })
        } else {
            console.log('el.sentences null', el)
        }
    });

    const countEn = allEn.reduce((map, item) => {
        map[item] = (map[item] || 0) + 1;
        return map;
    }, {});

    console.log('countEn', Object.keys(countEn).length);

    const countMap = allWords.reduce((map, item) => {
        map[item] = (map[item] || 0) + 1;
        return map;
    }, {});
    const uniqueArray = Object.keys(countMap);

    processedData.forEach(item => {
        const regex = new RegExp(`\\b${item.en}\\b`, "gi");
        const targetSentence = allsentences.filter(el => el.en.match(regex));
        if (targetSentence.length > 0) {
            item.sentences = [...targetSentence];
        } 
    });

    const enDict = {};

    for (const obj of processedData) {
        const enValue = obj.en;
        if (enValue in enDict) {
            enDict[enValue].cn.push(...obj.cn);
        } else {
            enDict[enValue] = { ...obj };
        }
    }

    const result = Object.values(enDict);
    console.log('dict length', result.length);

    const separate = ['，', ',', '；', ';'];
    const replace = ['v: ', 'adj: ', 'n: ', 'adv: ']
    result.forEach(item => {
        let newCn = [];
        item.cn.forEach(c => {
            let cc = c.replace(replace[0], '').replace(replace[1], '').replace(replace[2], '').replace(replace[3], '');
            separate.forEach(s => {
                let ss = cc.split(s);
                if (ss.length > 1) {
                    newCn = [...newCn, ...cc.split(s)]
                }
            });
        });

        if (newCn.length > 0) {
            item.cn = [...new Set(newCn)];
        }
    });

    console.log('result', result[1000])

    const jsonData = JSON.stringify(result, null, 0);
    fs.writeFile('scoreData.json', jsonData, 'utf8', (err) => {
        if (err) {
            console.error('寫入檔案時發生錯誤：', err);
            return;
        }
        console.log('processedData 成功寫入檔案！', processedData.length);
    });

    const jsonUniqueArray = JSON.stringify(uniqueArray, null, 2);
    fs.writeFile('uniqueArray.json', jsonUniqueArray, 'utf8', (err) => {
        if (err) {
            console.error('寫入檔案時發生錯誤：', err);
            return;
        }
        console.log('uniqueArray 成功寫入檔案！', uniqueArray.length);
    });

    const jsonCountMap = JSON.stringify(countMap, null, 2);
    fs.writeFile('countMap.json', jsonCountMap, 'utf8', (err) => {
        if (err) {
            console.error('寫入檔案時發生錯誤：', err);
            return;
        }
        console.log('countMap 成功寫入檔案！', countMap.length);
    });
});