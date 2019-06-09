var express = require('express');
var app = express();
// gbk转码
var iconv = require('iconv-lite');

var gb2312 = require("encode-gb2312");
// console.log(gb2312.encodeToGb2312("武汉")); // CEE4BABA

function addPer (str) {
  var copyStrArr = [];
  for (var i = 0; i < str.length; i++) {
    if (i % 2 == 0 && i != str.length - 1) {
      copyStrArr.push("%");
    }
    copyStrArr.push(str[i]);
  }
  return copyStrArr.join("");
}

// console.log(addPer(gb2312.encodeToGb2312("武汉")));
 
// /getcode?keyword=value
app.get('/getcode', function (req, res) {

  // console.log(req.query.keyword);
  var keyword = req.query.keyword;
  // 关键词转码加百分号
  keyword = addPer(gb2312.encodeToGb2312(keyword));
  
  function loadPage(url) {
      var http = require('http');
      var datas = [];

      var pm = new Promise(function (resolve, reject) {
          http.get(url, function (res) {
              var html = '';
              res.on('data', function (d) {
                  html += d.toString();
                  datas.push(d);
              });
              res.on('end', function () {
                  var total = iconv.decode(Buffer.concat(datas), 'GBK');
                  resolve(total);
              });
          }).on('error', function (e) {
              reject(e);
          });
      });
      return pm;
  }
  loadPage("http://opendata.baidu.com/post/s?wd=" + keyword + "&p=mini&rn=20").then(function (d) {
      // 页面代码提取table数据
      // var sum = d.match(/<tr>[^<tr>]*<\/tr>/g);

      var sum = d.match(/<tr[\w\W\S\s]+<\/tr>/);

      console.log(sum);
      res.send(d);
  });
});

app.listen(3000, function () {
  console.log('app is listening at port 3000');
});