function padleft (s, c, len) { while (s.length < len) s = c + s; return s }

// For an array of bytes, return a hex string in the form "FF.A2.B3"..
function hex (bytes) {
  var parts = []
  bytes.forEach(function (b) {
    parts.push(padleft(b.toString(16).toUpperCase(), '0', 2))
  })
  return parts.join('.')
}

// For a given byte integer (0-255), return an 8-bit string:
//      0xFF ->  1111 1111
//      0xC2 ->  1100 0010
//
function bits (b) {
  return padleft(b.toString(2), '0', 8).replace(/(.{4})/, '$1 ')
}

// Return array of 4 bytes for an integer in big-endian order
function byte4 (v) {
  return [ (v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF ]
}

// Given 4 bytes, return a formatted hex and bits information string:
//      0xFF  ->   '00.00.00.FF | 0000 0000 : 0000 0000 : 0000 0000 : 1111 1111'
function hex_and_bits (b4) {
  return hex(b4) + ' | ' + b4.map(bits).join(' : ')
}

// Given a unicode code point, return an array of UTF-8 encoded bytes.  Left-pad array with zeros to be 4 bytes long.
//      0x61 -> [ 0, 0, 0, 0x61 ]
//      0x10009 -> [ 0xF0, 0x90, 0x80, 0x89 ]
//
function utf8 (p) {
    // escape non-ascii as utf-8: 'abc\uD801\uDC00' -> 'abc%F0%90%90%80'
  var enc = encodeURIComponent(String.fromCodePoint(p))
  var ret = []
  for (var i = 0; i < enc.length;) {
    if (enc[i] === '%') {
      ret.push(parseInt(enc.substr(i + 1, 2), 16))  // hex
      i += 3
    } else {
      ret.push(enc.charCodeAt(i++))               // ascii
    }
  }
  while (ret.length < 4) ret.unshift(0)
  return ret
}

// Given a unicode code point, return an array of UTF-16 encoded bytes.  Left-pad array with zeros to be 4 bytes long.
//      0x61 -> [ 0, 0, 0, 0x61 ]
//      0x10009 -> [ 0xD8, 0x00, 0xDC, 0x09 ]
function utf16 (p) {
  var s = String.fromCodePoint(p)
  var hi = 0
  var lo = 0
  if (s.length === 2) {
    hi = s.charCodeAt(0)
    lo = s.charCodeAt(1)
  } else {
    lo = s.charCodeAt(0)
  }
  return [ (hi >> 8) & 0xFF, (hi & 0xFF), (lo >> 8) & 0xFF, (lo & 0xFF) ]
}

function code_point_char (cp) {
  var ret = '<?>'
  try { ret = String.fromCodePoint(cp) } catch (e) { }
  return ret
}

// see readme
function utfinfo (v, msg, opt) {
  opt = opt || {}
  var log = opt.log || console.log
  v = code_points(v)
  msg = msg || ''
  var code_points_for = v.length + ' code ' + (v.length === 1 ? 'point' : 'points') + ' for '
  log('==============================================================================')
  log(code_points_for + '" ' + String.fromCodePoint.apply(null, v) + ' ", ' + msg)
  log('    -----------')
  for (var i = 0; i < v.length; i++) {
    var cp = v[i]
    var countstr = '(' + (i + 1) + '/' + v.length + ')'
    log('    ' + countstr + ' " ' + code_point_char(cp) + ' ":')  // note: if we put this character on the output line, it can mess up column alignment
    log('    point :  ' + hex_and_bits(byte4(cp), bits))
    try {
      var u8 = utf8(cp)
      if (u8[0] || u8[1] || u8[2]) {
        log('    utf8  :  ' + hex_and_bits(utf8(cp), bits))
      }
    } catch (e) {}
    try {
      var u16 = utf16(cp)
      if (u16[0] || u16[1]) {
        log('    utf16 :  ' + hex_and_bits(utf16(cp), bits))
      }
    } catch (e) {}
    log('    -----------')
  }
}

// single line of code-point info see readme
function bitinfo (v, msg, opt) {
  opt = opt || {}
  var log = opt.log || console.log
  v = code_points(v)
  msg = msg ? ' : ' + msg : ''
  for (var i = 0; i < v.length; i++) {
    log('point :  ' + hex_and_bits(byte4(v[i]), bits) + ' | " ' + code_point_char(v[i]) + ' "' + msg)
  }
}

// Given a string or single code point, return an array of code-points.  Other types are returned as is.
// (gives flexibility to other function inputs by given back an array of code points for other types)
function code_points (v) {
  var ret
  switch (typeof v) {
    case 'number':
      ret = [v]
      break
    case 'string':
      ret = []
      var i = 0
      while (i < v.length) {
        ret[i] = v.codePointAt(i)
        i += ret[i] > 0xFFFF ? 2 : 1   // handle surrogate pairs (code points that span 2 string positions)
      }
      break
    default:
      ret = v
  }
    // v.forEach((c) => {if(c > 0x10FFFF) { throw Error('out of unicode range: ' + c)}})
  return ret
}

module.exports = {
  bitinfo: bitinfo,
  code_points: code_points,
  utfinfo: utfinfo
}
