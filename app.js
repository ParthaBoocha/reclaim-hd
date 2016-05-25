'use strict';

var rimraf = require('rimraf');
var fs = require('fs');
var path = require('path');

function app() {
    process.on('uncaughtException', function(err) {
        console.log('Unhandled exception: ' + err);
    });

    var dir = process.argv[2];
    var folderToDelete = process.argv[3];
    var errors = '';
    if (!dir) {
        errors += 'Pass the folder name or path as the first argument';
    }
    if (!folderToDelete) {
        errors += '\n' + 'Pass the folder spec to delete as the second argument';
    }

    if (errors) {
        console.log(errors);
        process.exit(0);
    }

    var folderSpec = [folderToDelete];

    console.log('deleting folders with name ' + folderSpec + ' in path ' + dir);

    // rimraf(dir, function(error) {
    //     if (error) {
    //         console.log('rimraf error: ' + error);
    //         return;
    //     }
    //     console.log('done!');
    // });

    var deleteFolders = [];
    var specComparator = folderSpec.length == 1 ? inSpecSingle : inSpecList;

    function getAllFoldersToDelete(dir, spec) {
        fs.readdirSync(dir).map(function(file) {
            var fullname = path.join(dir, file);
            if (fs.statSync(fullname).isDirectory()) {
                if (specComparator(file)) {
                    deleteFolders.push(fullname);
                    return;
                }
                getAllFoldersToDelete(fullname, spec);
            }
            return;
        });
    }

    function inSpecList(file) {
        if (folderSpec.indexOf(file) != -1) {
            return true;
        }
        return false;
    }

    function inSpecSingle(file) {
        return file === folderSpec[0];
    }

    getAllFoldersToDelete(dir, folderSpec);

    deleteFolders.forEach(function(folder) {
        console.log(folder);
    });
}

app();