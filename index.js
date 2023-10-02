const pipeline = require('icomoon-cli');
const fs = require('fs');
const iconPath = './icons/';

const getIcons = () => {
    const iconList = fs.readdirSync(iconPath);
    const icons = iconList.map(icon => iconPath + icon);
    const names = iconList.map(icon => icon.split('.')[0]);
    return {
        icons,
        names
    };
}

const runCase = (name, fn) => new Promise((resolve, reject) => {
    function done(err) {
        if (err) {
            console.log('============= Assertion failed =============');
            reject();
            process.exit(1);
        } else {
            console.log('============= Assertion passed =============');
            resolve();
        }
    }
    console.log(`\r\n============= Start '${name}' =============`);
    fn(done);
});

const changeStyleFile = (filePath) => {
    let fileData = fs.readFileSync(filePath  , 'utf-8');
    fileData = fileData.replace('[class*=" sbt-icon-"] {', '[class*="sbt-icon-"], [class*="sbt-icon-"] * {'); // FIX: for edu player
    fs.writeFileSync(filePath, fileData);
}


(async function() {
    const icons = getIcons();
    await runCase('build icons', done => {
        pipeline({
            icons: icons.icons,
            names: icons.names,
            selectionPath: 'selection.json',
            outputDir: 'dist',
            forceOverride: true,
            visible: false,
            whenFinished (result) {
                changeStyleFile('./dist/style.css')
                changeStyleFile('./dist/style.scss')
                fs.renameSync('./dist/demo.html', './dist/index.html');
            }
        });
    });
})();


