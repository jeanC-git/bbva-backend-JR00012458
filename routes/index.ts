import { Router } from "express";
import { readdirSync } from 'fs';

const PATH_ROUTER = `${__dirname}`;

const router = Router();

const cleanFileName = (fileName: string) => {
    return fileName.split('.').shift();
}

const isDotMapFile = (fileName:string) => {
    return fileName.indexOf('.map') !== -1;
}

readdirSync(PATH_ROUTER).filter((fileName) => {

    const cleanName = cleanFileName(fileName);
    const isMapFile = isDotMapFile(fileName);

    if (cleanName !== 'index' && !isMapFile) {

        import(`./${cleanName}`).then((moduleRouter) => {

            console.log(`Loading routes ... /${cleanName} was loaded.`);

            router.use(`/${cleanName}`, moduleRouter.router);

        });
    }

})

export { router };