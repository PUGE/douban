const request = require('request');

const XXH = require('xxhashjs')
// XXH 需要支持 copy
Uint8Array.prototype.copy = function copy(target, targetStart, start, end) {
  if (!start)
      start = 0
  if (!end && end !== 0)
      end = this.length
  if (targetStart >= target.length)
      targetStart = target.length
  if (!targetStart)
      targetStart = 0
  if (end > 0 && end < start)
      end = start
  // Copy 0 bytes; we're done
  if (end === start)
      return 0
  if (target.length === 0 || this.length === 0)
      return 0
  // Fatal error conditions
  if (targetStart < 0) {
      throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length)
      throw new RangeError('sourceStart out of bounds')
  if (end < 0)
      throw new RangeError('sourceEnd out of bounds')
  // Are we oob?
  if (end > this.length)
      end = this.length
  if (target.length - targetStart < end - start) {
      end = target.length - targetStart + start
  }
  var len = end - start
  var i
  if (this === target && start < targetStart && targetStart < end) {
      // descending copy from end
      for (i = len - 1; i >= 0; i--) {
          target[i + targetStart] = this[i + start]
      }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
      // ascending copy from start
      for (i = 0; i < len; i++) {
          target[i + targetStart] = this[i + start]
      }
  } else {
      target._set(this.subarray(start, start + len), targetStart)
  }
  return len
}

Uint8Array.prototype.readUInt8 = function(t) {
  return this[t]
}

Uint8Array.prototype.readUInt32BE = function(t) {
  return 16777216 * this[t] + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3])
}
var J_read = function(t, e, r, n, o) {
  var i, a, s = 8 * o - n - 1, u = (1 << s) - 1, c = u >> 1, f = -7, l = r ? o - 1 : 0, h = r ? -1 : 1, p = t[e + l];
  for (l += h,
  i = p & (1 << -f) - 1,
  p >>= -f,
  f += s; f > 0; i = 256 * i + t[e + l],
  l += h,
  f -= 8)
      ;
  for (a = i & (1 << -f) - 1,
  i >>= -f,
  f += n; f > 0; a = 256 * a + t[e + l],
  l += h,
  f -= 8)
      ;
  if (0 === i)
      i = 1 - c;
  else {
      if (i === u)
          return a ? NaN : 1 / 0 * (p ? -1 : 1);
      a += Math.pow(2, n),
      i -= c
  }
  return (p ? -1 : 1) * a * Math.pow(2, i - n)
}

Uint8Array.prototype.readInt8 = function(t, e) {
  return 128 & this[t] ? -1 * (255 - this[t] + 1) : this[t]
}
;
Uint8Array.prototype.readInt16LE = function(t, e) {

  var r = this[t] | this[t + 1] << 8;
  return 32768 & r ? 4294901760 | r : r
}
;
Uint8Array.prototype.readInt16BE = function(t, e) {

  var r = this[t + 1] | this[t] << 8;
  return 32768 & r ? 4294901760 | r : r
}
;
Uint8Array.prototype.readInt32LE = function(t, e) {
  return this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24
}
;
Uint8Array.prototype.readInt32BE = function(t, e) {
  return this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]
}
;
Uint8Array.prototype.readFloatLE = function(t, e) {
  return J_read(this, t, !0, 23, 4)
}
;
Uint8Array.prototype.readFloatBE = function(t, e) {
  return J_read(this, t, !1, 23, 4)
}
;
Uint8Array.prototype.readDoubleLE = function(t, e) {
  return J_read(this, t, !0, 52, 8)
}
;
Uint8Array.prototype.readDoubleBE = function(t, e) {
  return J_read(this, t, !1, 52, 8)
}
Uint8Array.prototype.toString = function() {
  var t = 0 | this.length;
  return 0 === t ? "" : ucs2.apply(this, arguments)
}

var Q = 4096;
var P = function(t) {
  var e = t.length;
  if (e <= Q)
      return String.fromCharCode.apply(String, t);
  for (var r = "", n = 0; n < e; )
      r += String.fromCharCode.apply(String, t.slice(n, n += Q));
  return r
}
var T = function(t, e, r) {
  r = Math.min(t.length, r);
  for (var n = [], o = e; o < r; ) {
      var i = t[o]
        , a = null
        , s = i > 239 ? 4 : i > 223 ? 3 : i > 191 ? 2 : 1;
      if (o + s <= r) {
          var u, c, f, l;
          switch (s) {
          case 1:
              i < 128 && (a = i);
              break;
          case 2:
              u = t[o + 1],
              128 == (192 & u) && (l = (31 & i) << 6 | 63 & u) > 127 && (a = l);
              break;
          case 3:
              u = t[o + 1],
              c = t[o + 2],
              128 == (192 & u) && 128 == (192 & c) && (l = (15 & i) << 12 | (63 & u) << 6 | 63 & c) > 2047 && (l < 55296 || l > 57343) && (a = l);
              break;
          case 4:
              u = t[o + 1],
              c = t[o + 2],
              f = t[o + 3],
              128 == (192 & u) && 128 == (192 & c) && 128 == (192 & f) && (l = (15 & i) << 18 | (63 & u) << 12 | (63 & c) << 6 | 63 & f) > 65535 && l < 1114112 && (a = l)
          }
      }
      null === a ? (a = 65533,
      s = 1) : a > 65535 && (a -= 65536,
      n.push(a >>> 10 & 1023 | 55296),
      a = 56320 | 1023 & a),
      n.push(a),
      o += s
  }
  return P(n)
}
var N = function(t, e, r) {
  for (var n = t.slice(e, r), o = "", i = 0; i < n.length; i += 2)
      o += String.fromCharCode(n[i] + 256 * n[i + 1]);
  return o
}

var ucs2 = function(t, e, r) {
  var n = !1;
  if ((void 0 === e || e < 0) && (e = 0),
  e > this.length)
      return "";
  if ((void 0 === r || r > this.length) && (r = this.length),
  r <= 0)
      return "";
  if (r >>>= 0,
  e >>>= 0,
  r <= e)
      return "";
  for (t || (t = "utf8"); ; )
      switch (t) {
      case "hex":
          return j(this, e, r);
      case "utf8":
      case "utf-8":
          return T(this, e, r);
      case "ascii":
          return k(this, e, r);
      case "latin1":
      case "binary":
          return R(this, e, r);
      case "base64":
          return O(this, e, r);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
          return N(this, e, r);
      default:
          if (n)
              throw new TypeError("Unknown encoding: " + t);
          t = (t + "").toLowerCase(),
          n = !0
      }
}


var concat = function(arr0, arr1) {
  return new Uint8Array([...arr0, ...arr1]);
}

var hashuint16 = function(e) {
  return XXH.h64(e, 0xA1BD).toString(16)
}

var btool = function(r) {
  let i = 16;
  let a = Uint8Array.from(atob(r), c=>c.charCodeAt(0));
  let s = Math.max(Math.floor((a.length - 2 * i) / 3), 0)
  let u = new Uint8Array(a.slice(s, s + i));
  a = concat(a.slice(0, s), a.slice(s + i));
  var c = hashuint16(concat(u, Uint8Array.from("")));
  return [c, a]
}

var decrypto = function(e, r) {
  // "hjasbdn2ih823rgwudsde7e2dhsdhas";
  "string" == typeof r && (r = [].map.call(r, function(t) {
      return t.charCodeAt(0)
  }));
  for (var n, o = [], i = 0, a = new Uint8Array(e.length), s = 0; s < 256; s++)
      o[s] = s;
  for (s = 0; s < 256; s++)
      i = (i + o[s] + r[s % r.length]) % 256,
      n = o[s],
      o[s] = o[i],
      o[i] = n;
  s = 0,
  i = 0;
  for (var u = 0; u < e.length; u++)
      s = (s + 1) % 256,
      i = (i + o[s]) % 256,
      n = o[s],
      o[s] = o[i],
      o[i] = n,
      a[u] = e[u] ^ o[(o[s] + o[i]) % 256];
  return a
}

var debug = false;

var maxObjectSize = 100 * 1000 * 1000;
// 100Meg
var maxObjectCount = 32768;

// EPOCH = new SimpleDateFormat("yyyy MM dd zzz").parse("2001 01 01 GMT").getTime();
// ...but that's annoying in a static initializer because it can throw exceptions, ick.
// So we just hardcode the correct value.
var EPOCH = 978307200000;

// we're just going to toss the high order bits because javascript doesn't have 64-bit ints
function readUInt64BE(buffer, start) {
var data = buffer.slice(start, start + 8);
return data.readUInt32BE(4, 8);
}

function swapBytes(buffer) {
var len = buffer.length;
for (var i = 0; i < len; i += 2) {
  var a = buffer[i];
  buffer[i] = buffer[i+1];
  buffer[i+1] = a;
}
return buffer;
}


function readUInt(buffer, start) {
start = start || 0;

var l = 0;
for (var i = start; i < buffer.length; i++) {
  l <<= 8;
  l |= buffer[i] & 0xFF;
}
return l;
}

var parseBuffer = function(buffer) {
  var result = {};

  // Handle trailer, last 32 bytes of the file
  var trailer = buffer.slice(buffer.length - 32, buffer.length);
  // 6 null bytes (index 0 to 5)
  var offsetSize = trailer.readUInt8(6);
  if (debug) {
      console.log("offsetSize: " + offsetSize);
  }
  var objectRefSize = trailer.readUInt8(7);
  if (debug) {
      console.log("objectRefSize: " + objectRefSize);
  }
  var numObjects = readUInt64BE(trailer, 8);
  if (debug) {
      console.log("numObjects: " + numObjects);
  }
  var topObject = readUInt64BE(trailer, 16);
  if (debug) {
      console.log("topObject: " + topObject);
  }
  var offsetTableOffset = readUInt64BE(trailer, 24);
  if (debug) {
      console.log("offsetTableOffset: " + offsetTableOffset);
  }

  if (numObjects > maxObjectCount) {
      throw new Error("maxObjectCount exceeded");
  }

  // Handle offset table
  var offsetTable = [];

  for (var i = 0; i < numObjects; i++) {
      var offsetBytes = buffer.slice(offsetTableOffset + i * offsetSize, offsetTableOffset + (i + 1) * offsetSize);
      offsetTable[i] = readUInt(offsetBytes, 0);
      if (debug) {
          console.log("Offset for Object #" + i + " is " + offsetTable[i] + " [" + offsetTable[i].toString(16) + "]");
      }
  }

  // Parses an object inside the currently parsed binary property list.
  // For the format specification check
  // <a href="http://www.opensource.apple.com/source/CF/CF-635/CFBinaryPList.c">
  // Apple's binary property list parser implementation</a>.
  function parseObject(tableOffset) {
      var offset = offsetTable[tableOffset];
      var type = buffer[offset];
      var objType = (type & 0xF0) >> 4;
      //First  4 bits
      var objInfo = (type & 0x0F);
      //Second 4 bits
      switch (objType) {
      case 0x0:
          return parseSimple();
      case 0x1:
          return parseInteger();
      case 0x8:
          return parseUID();
      case 0x2:
          return parseReal();
      case 0x3:
          return parseDate();
      case 0x6:
          return parseData();
      case 0x4:
          // ASCII
          return parsePlistString();
      case 0x5:
          // UTF-16
          return parsePlistString(true);
      case 0xA:
          return parseArray();
      case 0xD:
          return parseDictionary();
      default:
          throw new Error("Unhandled type 0x" + objType.toString(16));
      }

      function parseSimple() {
          //Simple
          switch (objInfo) {
          case 0x0:
              // null
              return null;
          case 0x8:
              // false
              return false;
          case 0x9:
              // true
              return true;
          case 0xF:
              // filler byte
              return null;
          default:
              throw new Error("Unhandled simple type 0x" + objType.toString(16));
          }
      }

      function parseInteger() {
          var length = Math.pow(2, objInfo);
          if (length < maxObjectSize) {
              return readUInt(buffer.slice(offset + 1, offset + 1 + length));
          } else {
              throw new Error("To little heap space available! Wanted to read " + length + " bytes, but only " + maxObjectSize + " are available.");
          }
      }

      function parseUID() {
          var length = objInfo + 1;
          if (length < maxObjectSize) {
              return readUInt(buffer.slice(offset + 1, offset + 1 + length));
          } else {
              throw new Error("To little heap space available! Wanted to read " + length + " bytes, but only " + maxObjectSize + " are available.");
          }
      }

      function parseReal() {
          var length = Math.pow(2, objInfo);
          if (length < maxObjectSize) {
              var realBuffer = buffer.slice(offset + 1, offset + 1 + length);
              if (length === 4) {
                  return realBuffer.readFloatBE(0);
              } else if (length === 8) {
                  return realBuffer.readDoubleBE(0);
              }
          } else {
              throw new Error("To little heap space available! Wanted to read " + length + " bytes, but only " + maxObjectSize + " are available.");
          }
      }

      function parseDate() {
          if (objInfo != 0x3) {
              console.error("Unknown date type :" + objInfo + ". Parsing anyway...");
          }
          var dateBuffer = buffer.slice(offset + 1, offset + 9);
          return new Date(EPOCH + (1000 * dateBuffer.readDoubleBE(0)));
      }

      function parseData() {
          var dataoffset = 1;
          var length = objInfo;
          if (objInfo == 0xF) {
              var int_type = buffer[offset + 1];
              var intType = (int_type & 0xF0) / 0x10;
              if (intType != 0x1) {
                  console.error("0x4: UNEXPECTED LENGTH-INT TYPE! " + intType);
              }
              var intInfo = int_type & 0x0F;
              var intLength = Math.pow(2, intInfo);
              dataoffset = 2 + intLength;
              if (intLength < 3) {
                  length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
              } else {
                  length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
              }
          }
          if (length < maxObjectSize) {
              return buffer.slice(offset + dataoffset, offset + dataoffset + length);
          } else {
              throw new Error("To little heap space available! Wanted to read " + length + " bytes, but only " + maxObjectSize + " are available.");
          }
      }

      function parsePlistString(isUtf16) {
          isUtf16 = isUtf16 || 0;
          var enc = "utf8";
          var length = objInfo;
          var stroffset = 1;
          if (objInfo == 0xF) {
              var int_type = buffer[offset + 1];
              var intType = (int_type & 0xF0) / 0x10;
              if (intType != 0x1) {
                  console.err("UNEXPECTED LENGTH-INT TYPE! " + intType);
              }
              var intInfo = int_type & 0x0F;
              var intLength = Math.pow(2, intInfo);
              var stroffset = 2 + intLength;
              if (intLength < 3) {
                  length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
              } else {
                  length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
              }
          }
          // length is String length -> to get byte length multiply by 2, as 1 character takes 2 bytes in UTF-16
          length *= (isUtf16 + 1);
          if (length < maxObjectSize) {
              var plistString = Buffer.from(buffer.slice(offset + stroffset, offset + stroffset + length));
              if (isUtf16) {
                  plistString = swapBytes(plistString);
                  enc = "ucs2";
              }
              return plistString.toString(enc);
          } else {
              throw new Error("To little heap space available! Wanted to read " + length + " bytes, but only " + maxObjectSize + " are available.");
          }
      }

      function parseArray() {
          var length = objInfo;
          var arrayoffset = 1;
          if (objInfo == 0xF) {
              var int_type = buffer[offset + 1];
              var intType = (int_type & 0xF0) / 0x10;
              if (intType != 0x1) {
                  console.error("0xa: UNEXPECTED LENGTH-INT TYPE! " + intType);
              }
              var intInfo = int_type & 0x0F;
              var intLength = Math.pow(2, intInfo);
              arrayoffset = 2 + intLength;
              if (intLength < 3) {
                  length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
              } else {
                  length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
              }
          }
          if (length * objectRefSize > maxObjectSize) {
              throw new Error("To little heap space available!");
          }
          var array = [];
          for (var i = 0; i < length; i++) {
              var objRef = readUInt(buffer.slice(offset + arrayoffset + i * objectRefSize, offset + arrayoffset + (i + 1) * objectRefSize));
              array[i] = parseObject(objRef);
          }
          return array;
      }

      function parseDictionary() {
          var length = objInfo;
          var dictoffset = 1;
          if (objInfo == 0xF) {
              var int_type = buffer[offset + 1];
              var intType = (int_type & 0xF0) / 0x10;
              if (intType != 0x1) {
                  console.error("0xD: UNEXPECTED LENGTH-INT TYPE! " + intType);
              }
              var intInfo = int_type & 0x0F;
              var intLength = Math.pow(2, intInfo);
              dictoffset = 2 + intLength;
              if (intLength < 3) {
                  length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
              } else {
                  length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
              }
          }
          if (length * 2 * objectRefSize > maxObjectSize) {
              throw new Error("To little heap space available!");
          }
          if (debug) {
              console.log("Parsing dictionary #" + tableOffset);
          }
          var dict = {};
          for (var i = 0; i < length; i++) {
              var keyRef = readUInt(buffer.slice(offset + dictoffset + i * objectRefSize, offset + dictoffset + (i + 1) * objectRefSize));
              var valRef = readUInt(buffer.slice(offset + dictoffset + (length * objectRefSize) + i * objectRefSize, offset + dictoffset + (length * objectRefSize) + (i + 1) * objectRefSize));
              var key = parseObject(keyRef);
              var val = parseObject(valRef);
              if (debug) {
                  console.log("  DICT #" + tableOffset + ": Mapped " + key + " to " + val);
              }
              dict[key] = val;
          }
          return dict;
      }
  }

  return [parseObject(topObject)];
};
// 这里放拷贝过来的数据


const searchText = '靴子'


const Tool = {
  wow:{
    isMillisecondStamp:function(num){if(num.length===10){return num*1000;}else if(num.length===13) {return num;}else {console.log(num+"不是一个标准的时间戳！");return false;}},
    ifStringGetElementById:function(target){if(typeof target==="string") {return document.getElementById(target);}else {return target;}},
  },
  text: {
    //分割字符串
    cutString:function(original,before,after,index) {
      index = index || 0;
      if (typeof index === "number") {
        const P = original.indexOf(before, index);
        if (P > -1) {
          if (after) {
            const f = original.indexOf(after, P + before.length);
            return (f>-1)? original.slice(P + before.toString().length, f):console.error("Tool [在文本中找不到 参数三 "+after+"]");
          } else {
            return original.slice(P + before.toString().length);
          }
        } else {
          console.error("Tool [在文本中找不到 参数一 " + before + "]");
          return
        }
      } else {
        console.error("Tool [sizeTransition:" + index + "不是一个整数!]");
      }
    },
    //根据一个基点分割字符串  实例：http://myweb-10017157.cos.myqcloud.com/20161212/%E7%BB%83%E4%B9%A0.zip
    cutStringPoint:function (original,str, before, after,order, index) {index = index || 0;if (typeof index === "number") {const O = original.indexOf(str, index);const P = (order[0]==="1")?original.lastIndexOf(before, O):original.indexOf(before, O);if (P > -1) {if (after) {let f ;switch (order[1]){case "1":f = original.indexOf(after, P + 1);break;case "2":f = original.indexOf(after, O + 1);break;case "3":f = original.lastIndexOf(after, O + 1);break;}return (f>-1)? original.slice(P + before.toString().length, f):console.error("Tool [在文本中找不到 参数三 "+after+"]");}else {return original.slice(P + before.toString().length);}}else {console.error("Tool [在文本中找不到 参数一 " + before + "]");}} else {console.error("Tool [sizeTransition:" + index + "不是一个整数!]");}},
    //分割字符串组
    cutStringArray:function(original,before,after,index){var aa=[],ab=0;while(original.indexOf(before,index)>0){aa[ab]=Tool.text.cutString(original,before,after,index);index=original.indexOf(before,index)+1;ab++;}return aa;},
    randomString:function(n){const str = 'abcdefghijklmnopqrstuvwxyz9876543210';let tmp = '',i = 0,l = str.length;for (i = 0; i < n; i++) {tmp += str.charAt(Math.floor(Math.random() * l));}return tmp;},
    replaceAll: function (temp, oString, nString) {
      if (!temp) return temp
      var startInd = -1
      while (temp.indexOf(oString, startInd) >= 0) {
        const findIndex = temp.indexOf(oString, startInd)
        temp = temp.substr(0, findIndex) + nString + temp.substr(findIndex + oString.length)
        startInd = findIndex + (nString.length - oString.length)
      }
      return temp
    },
    countSubstr: function (temp, oString) {
      if (!temp) return temp
      var startInd = -1
      var tempIndex = 0
      while (temp.indexOf(oString, startInd) >= 0) {
        const findIndex = temp.indexOf(oString, startInd)
        startInd = findIndex + 1
        tempIndex++
      }
      return tempIndex
    }
  },
  num: {
    randomNum: function (minNum,maxNum){ 
      switch(arguments.length){ 
        case 1: 
          return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
          return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
        default: 
          return 0; 
        break;
      }
    }
  },
  date: {
      GetDateStr: function (AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth()+1;//获取当前月份的日期
        var d = dd.getDate();
    if (m < 10) m = "0" + m
        if (d < 10) d = "0" + d
        return y+"-"+m+"-"+d;
    }
  }
}

var options = {
  'method': 'GET',
  'url': 'https://search.douban.com/movie/subject_search?search_text=' + encodeURI(searchText),
  'headers': {
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  const __DATA__ = Tool.text.cutString(response.body, 'window.__DATA__ = "', '"')
  // console.log(__DATA__);
  var result0 = btool(__DATA__);
  // console.warn(result0);
  result1 = decrypto(result0[1], result0[0])
  // console.warn(result1);
  console.warn(JSON.stringify(parseBuffer(result1)))
});
