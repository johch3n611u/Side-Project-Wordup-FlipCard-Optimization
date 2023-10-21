const fs = require('fs');

// 讀取 JSON 檔案
fs.readFile('scoreData.json', 'utf8', (err, data) => {
    const processedData = JSON.parse(data);
    const pickedObjects = [];
    const filteredArray = processedData.filter(obj => typeof obj.score === 'number');
    const totalScore = filteredArray.reduce((sum, obj) => sum + obj.score, 0);
    while (pickedObjects.length < 10) {
        const random = Math.random() * totalScore;
        let cumulativeScore = 0;

        for (let i = 0; i < processedData.length; i++) {
            cumulativeScore += processedData[i].score;
            if (random <= cumulativeScore) {
                pickedObjects.push(processedData[i]);
                break;
            }
        }
    }

    console.log(pickedObjects);
});