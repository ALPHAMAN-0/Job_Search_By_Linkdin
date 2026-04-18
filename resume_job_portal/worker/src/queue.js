const tasks = [];

function enqueue(task) {
	tasks.push(task);
	return Promise.resolve()
		.then(() => task())
		.finally(() => {
			tasks.shift();
		});
}

module.exports = { enqueue };
