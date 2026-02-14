import DataUriParser from "datauri/parser.js"

import path from "path";

const dataUriParser = new DataUriParser();

export const getDataUri = (file) => {
    const extname = path.extname(file.originalname).toString();
    return dataUriParser.format(extname, file.buffer).content;
};

export default getDataUri;