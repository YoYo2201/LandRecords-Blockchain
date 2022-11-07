const command = 'ipfs add '+filePath;
  var yourscript = exec('ipfs add ',
        (error, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });