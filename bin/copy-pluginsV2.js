const fse = require('fs-extra');

function copyFolderRecursiveSync(srcDir, destDir) {
    // To copy a folder or file  
    fse.copySync(srcDir, destDir, function (err) {
        if (err) {                 
            console.error(err);    
        } else {
            console.log(`success copied ${srcDir}`);
        }
    });
}

//console.log('starting copy of ghost-storage-cloudinary')
//copyFolderRecursiveSync('./node_modules/ghost-storage-cloudinary', './content/adapters/storage/ghost-storage-cloudinary')
//console.log('copied ghost-storage-cloudinary')

console.log('starting copy of casper theme')
copyFolderRecursiveSync('./node_modules/casper', './content/themes/casper')
console.log('copied casper theme')