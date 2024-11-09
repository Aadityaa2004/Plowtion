import clientPromise from "./db";

export async function clidb() {
    const cl = clientPromise;
    return cl.db();
}

export async function GetData(number: number) {
    const db = await clidb();
    const blogdb = db.collection("");
    const data = blogdb.find({}).sort({ _id: -1 }).limit(number).toArray();
    return data;
}