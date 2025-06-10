const tests = {
    '': '9c1185a5c5e9fc54612808977ee8f548b2258d31',
    'a': '0bdc9d2d256b3ee9daae347be6f4dc835a467ffe',
    'abc': '8eb208f7e05d987a9b044a8e98c6b087f15a0bfc',
    'message digest': '5d0689ef49d2fae572b881b123a85ffa21595f36',
    'abcdefghijklmnopqrstuvwxyz': 'f71c27109c692c1b56bbdceb5b9d2865b3708dbc',
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789': 'b0e20b6e3116640286ed3a87a5713079b21f5189',
    '12345678901234567890123456789012345678901234567890': '2c53e0d73198f19ee1fcef4fe224d75269668f8c'
}

const ripemd160 = require('../src/main.js')
for (const input of Object.keys(tests)) {
    const output = tests[input]
    if (ripemd160(input) !== tests[input]) {
        throw `input failed ${input} ${ripemd160(input)} should be ${output}`
    }
}

console.log('✅ tests passed')
