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
                // you can get the absolute path of output directory via result.outputDir
            }
        });
    });
})();


