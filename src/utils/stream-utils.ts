import stream from "stream"

const readStreamToString = (stream: stream.Readable): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        let result = '';
        stream.on('data', (data) => result += data.toString());
        stream.on('end', () => resolve(result));
        stream.on('error', (err) => reject(err));
    });
}

export { readStreamToString }