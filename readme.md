# qb-bithelp

Functions for viewing and understanding binary encodings.

Install:

    npm install qb-bithelp
    

## bitinfo()

Print hex/bit information about code points (integers) or strings:

    var bhelp = require('qb-bithelp');

    bhelp.bitinfo('abcé');

    > code-point :  00.00.00.61 | 0000 0000 : 0000 0000 : 0000 0000 : 0110 0001 | a
    > code-point :  00.00.00.62 | 0000 0000 : 0000 0000 : 0000 0000 : 0110 0010 | b
    > code-point :  00.00.00.63 | 0000 0000 : 0000 0000 : 0000 0000 : 0110 0011 | c
    > code-point :  00.00.00.E9 | 0000 0000 : 0000 0000 : 0000 0000 : 1110 1001 | é
    
    bhelp.bitinfo('做法方便上手。')
    > code-point :  00.00.50.5A | 0000 0000 : 0000 0000 : 0101 0000 : 0101 1010 | 做
    > code-point :  00.00.6C.D5 | 0000 0000 : 0000 0000 : 0110 1100 : 1101 0101 | 法
    > code-point :  00.00.65.B9 | 0000 0000 : 0000 0000 : 0110 0101 : 1011 1001 | 方
    > code-point :  00.00.4F.BF | 0000 0000 : 0000 0000 : 0100 1111 : 1011 1111 | 便
    > code-point :  00.00.4E.0A | 0000 0000 : 0000 0000 : 0100 1110 : 0000 1010 | 上
    > code-point :  00.00.62.4B | 0000 0000 : 0000 0000 : 0110 0010 : 0100 1011 | 手
    > code-point :  00.00.30.02 | 0000 0000 : 0000 0000 : 0011 0000 : 0000 0010 | 。
    
    bhelp.bitinfo( [0x61, 0x62] );      // also can pass array of code points or single points

    > code-point :  00.00.00.61 | 0000 0000 : 0000 0000 : 0000 0000 : 0110 0001 | a
    > code-point :  00.00.00.62 | 0000 0000 : 0000 0000 : 0000 0000 : 0110 0010 | b
    

# utfinfo()

Print hex/bit information for a raw (code-point), UTF-8, and UTF-16 encodings - only print
UTF-8 and UTF-16 if different from raw code-point (e.g. non-ascii etc)

    bhelp.utfinfo('e')
    
    > a
    > code-point :  00.00.00.61 | 0000 0000 : 0000 0000 : 0000 0000 : 0110 0001

    bhelp.utfinfo(é);
    
    > é
    > code-point :  00.00.00.E9 | 0000 0000 : 0000 0000 : 0000 0000 : 1110 1001
    > utf8       :  00.00.C3.A9 | 0000 0000 : 0000 0000 : 1100 0011 : 1010 1001

    (UTF-16 is same as code-point)
                
    bhelp.utfinfo(0x10009);                    
                
    > 𐀉
    > code-point :  00.01.00.09 | 0000 0000 : 0000 0001 : 0000 0000 : 0000 1001
    > utf8       :  F0.90.80.89 | 1111 0000 : 1001 0000 : 1000 0000 : 1000 1001
    > utf16      :  D8.00.DC.09 | 1101 1000 : 0000 0000 : 1101 1100 : 0000 1001

