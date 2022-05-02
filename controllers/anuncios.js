const Anuncio = require('../models/Anuncio');

const anunciosQuery = async (args) => {
    try {
        args = args.tag ?  args = {...args,tags:{$in:args.tag}} : args;
        const docs = await Anuncio.find(args)
        .where('precio')
        .gt(args.min ? parseInt(args.min) - 1 : 0)
        .lt(args.max ? parseInt(args.max) + 1 : Infinity)
        .skip(args.skip ? parseInt(args.skip) : 0) 
        .limit(args.limit ? parseInt(args.limit) : 0);
        if(docs.length === 0) return {ok:true,result:{rows:[]},total:0};
        return {ok:true,result:{rows:docs},total:docs.length};
    } catch (error) {
        throw error;
    }
};

const getAnuncios = async (req,res,next) => {
    try {
        const { query } = req;
        let args = {...query};
        const resp = await anunciosQuery(args);
        return res.status(200).send({ok:true,rows:resp.result.rows});
    } catch (error) {
        next(error);
    }
};

module.exports = {
    anunciosQuery,
    getAnuncios
};