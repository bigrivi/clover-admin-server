exports = module.exports = function(req, res, next)
{
	if(req.params.id){
		next()
	}
	else{
		req.quer.limit(0).skip(0).count(function(err, num) {
			res.locals.bundle = {record_count:num,result:res.locals.bundle};
			next()
		})
	}
}