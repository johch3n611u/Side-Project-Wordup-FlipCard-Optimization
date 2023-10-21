const fs = require('fs');

fs.readFile('importData.json', 'utf8', (err, data) => {

  if (err) {
    console.error('讀取檔案時發生錯誤：', err);
    return;
  }

  try {
    const importData = JSON.parse(data);
    const cards = importData.cards;
    const importDataMeta = importData.meta;

    fs.readFile('meta.json', 'utf8', (err, metaData) => {
      let findMeta, metaArray = [];
      if (metaData) {
        metaArray = JSON.parse(metaData);
        if (importDataMeta.deck_name) {
          findMeta = metaArray.find(meta => meta === importDataMeta.deck_name);
        } else {
          console.log('importDataMeta.deck_name miss', importDataMeta)
        }
      }

      if (!findMeta) {

        metaArray.push(importDataMeta.deck_name);
        const metaArrayJsonData = JSON.stringify(metaArray, null, 2);
        fs.writeFile('meta.json', metaArrayJsonData, 'utf8', (err) => {
          if (err) {
            console.error('meta.json 寫入檔案時發生錯誤：', err);
            return;
          }
        });

        const words = cards.map(el => {
          let word = {};
          word.en = el.word;

          let content, i = 0;
          while (!content) {
            if (el.text_content.explanations[i]) {
              content = el.text_content.explanations[i];
              if (i !== 0) {
                console.log('explanations 不等於第 0 筆', i, content);
              }
            } else {
              console.log('content miss', el.text_content.explanations);
            }
            i++;
          }

          if (content) {

            if (content.translations) {
              word.cn = content.translations;
            } else {
              console.log('content.translations miss', content);
            }

            if (content.sentences) {
              word.sentences = content.sentences.reduce((result, sentence, index) => {
                if (index % 2 === 0) {
                  result.push({ en: sentence, cn: content.sentences[index + 1] });
                }
                return result;
              }, []);
            } else {
              console.log('sentences null', el)
            }
            return word;
          } else {
            console.log(content);
            console.log(el.text_content.explanations);
          }
        });

        fs.readFile('processedData.json', 'utf8', (err, processedData) => {
          if (err) {
            console.error('讀取 processedData.json 檔案時發生錯誤：', err);
            return;
          }

          try {
            let newProcessedData = [];
            if (processedData) {
              const existingData = JSON.parse(processedData);
              newProcessedData = [...existingData, ...words];
            } else {
              newProcessedData = [...words];
            }
            const jsonData = JSON.stringify(newProcessedData, null, 2);

            fs.writeFile('processedData.json', jsonData, 'utf8', (err) => {
              if (err) {
                console.error('寫入檔案時發生錯誤：', err);
                return;
              }
              console.log('成功寫入檔案！');
            });

            console.log(newProcessedData.length);

          } catch (err) {
            console.error('解析 JSON processedData 時發生錯誤：', err);
          }
        });
      }
    });

  } catch (err) {
    console.error('解析 JSON 時發生錯誤：', err);
  }
});