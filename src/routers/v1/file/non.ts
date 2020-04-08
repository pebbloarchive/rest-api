import { Router } from 'express';
import token from '../../../middleware/token';
import fs from 'fs';
import { v4 } from 'uuid';

const router = Router();

router.post('/upload', token, async(req, res) => {
    const { file } = req.body;
    if(!file) return res.status(400).json({ error: `There was no fil${file.length > 1 ? 'es' : 'e'} provided in the request body.` });
    let fileName: any = [];
    let fileContent: any = [];
    let erroredFiles: any = {
        size: [],
        type: []
    };
    let extensions: any = ['gif', 'jpg', 'png', 'mp4', 'mov'];
    let str: String = '';

    for (let i=0; i<file.length; i++) {
        let temp = file[i].split('\\')[file[i].split('\\').length-1];
        let extension = temp.split('.')[temp.split('.').length-1].toLowerCase();
        if (extensions.includes(extension)) {
            let stat = fs.statSync(file[i]);
            let size = stat.size / 1073741824;
            // Check if file size is below 512
            if (extension !== 'gif') {
                if (size <= 0.512) {
                    fileName.push(temp)
                let readFile = fs.readFileSync(file[i]);
                fileContent.push(readFile);
                // If file size is over 512mb
                } else {
                    // Add file to erroredFiles because of invalid size
                    erroredFiles.size.push(temp);
                }
            } else {
                // Check if gif size is below 50mb
                if (size <= 0.05) {
                    fileName.push(temp)
                let readFile = fs.readFileSync(file[i]);
                fileContent.push(readFile);
                // If gif size is over 50mb
                } else {
                    // Add gif to erroredFiles because it's over 50mb
                    erroredFiles.size.push(temp)
                }
            }
        } else {
            // Add file to erroredFiles because of invalid extension
            erroredFiles.type.push(temp);
        }
    }

    for (let i=0; i<fileName.length; i++) {
        let folderID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        fs.writeFile(`../../../somepath/${folderID}/${fileName[i]}`, fileContent[i], function(err) {
            if (err) return console.log(err);
            console.log(`Created file: ${fileName[i]}`);
        })
    }

    for (let i=0; i<erroredFiles.size.length; i++) {
        if (!str.includes('SizeError'))
            str += `SizeError: (The following files are larger than 512mb and therefore failed to upload)/(GIFs can't be over 50mb)`;
        str += `\n->${erroredFiles.size[i]}`;
    }

    for (let i=0; i<erroredFiles.type.length; i++) {
        if (!str.includes('TypeError'))
            str += `\nTypeError: (The following files have invalid extensions (not PNG/JPG/GIF/MP4/MOV)`
        str += `\n->${erroredFiles.type[i]}`;
    }

    if (str.length)
        console.log(str);
});

// oh yeah also could you make a gitlab account then send me your name so i can add you to the repo
// sure lul

export default router;

// max image size should be 512 mb
// gifs shouldn't be over 15 mb
// we should only accept We accept GIF, JPEG(JPG), and PNG files.
// video formats should be MP4 and MOV (max video size 512 mb)
