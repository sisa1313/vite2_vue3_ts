const fun = {
  fmoney: (number, decimals, dec_point, thousands_sep, round_tag) => {
    // number：需要处理的数字；
    // decimals：保留几位小数，默认两位，可不传；
    // dec_point：小数点符号，默认为‘.’，可不传；
    // thousands_sep：千分位符号，默认为‘,’，可不传;
    // round_tag:舎入方式，默认为四舍五入（'round'），可不传； 向上取值（'ceil'）；向下取值（'floor'）;

    // var pattern = /^\d+(\.\d+)?$/;
    // if (!pattern.test(number)) {
    //   return '';
    // }
    var maxNum = 999999999999999.9999; // 最大处理的数字
    number = parseFloat(number);
    if (number >= maxNum) {
      return '';
    }
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    decimals = decimals || 2; // 默认保留2位
    dec_point = dec_point || '.'; // 默认是'.';
    thousands_sep = thousands_sep || ','; // 默认是',';
    round_tag = round_tag || 'round'; // 默认是四舍五入
    var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep,
      dec = typeof dec_point === 'undefined' ? '.' : dec_point,
      s = '',
      toFixedFix = function (n, prec) {
        var k = Math.pow(10, prec);
        return (
          '' +
          parseFloat(Math[round_tag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)) / k
        );
      };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    var re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
      s[0] = s[0].replace(re, '$1' + sep + '$2');
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
  },
  // Vue.prototype.sessionGet = function(item) {
  //   return JSON.parse(sessionStorage.getItem(item));
  // };
  // Vue.prototype.sessionSet = function(item, obj) {
  //   sessionStorage.setItem(item, JSON.stringify(obj));
  // };
  // Vue.prototype.sessionRemove = function(item) {
  //   sessionStorage.removeItem(item);
  // };
  // Vue.prototype.sessionClear = function() {
  //   sessionStorage.clear();
  // };
  // Vue.prototype.localGet = function(item) {
  //   return localStorage.getItem(item) == 'undefined' ? undefined : JSON.parse(localStorage.getItem(item));
  // };
  // Vue.prototype.localSet = function(item, obj) {
  //   localStorage.setItem(item, JSON.stringify(obj));
  // };
  // Vue.prototype.localRemove = function(item) {
  //   localStorage.removeItem(item);
  // };
  // Vue.prototype.localClear = function() {
  //   localStorage.clear();
  // };
};
export default fun;
