npm install
npm install typescript -g
npm install -g ts-node
npm install nodemon -g
npm install https -g

if [[ "$ENVIRONMENT" == "dev" ]] ; then
	#Environment developper, run hot-reload server
	nodemon ./run.ts
else
	#Environment production, run static server
	tsc
	node ./bin/run.js
fi