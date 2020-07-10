var debug = require("debug");
var debugLog = debug("btcexp:config");

var fs = require('fs');
var crypto = require('crypto');
var url = require('url');

var coins = require("./coins.js");
var credentials = require("./credentials.js");

var currentCoin = process.env.BGEXP_COIN || "BG";

var rpcCred = credentials.rpc;

if (rpcCred.cookie && !rpcCred.username && !rpcCred.password && fs.existsSync(rpcCred.cookie)) {
	console.log(`Loading RPC cookie file: ${rpcCred.cookie}`);
	
	[ rpcCred.username, rpcCred.password ] = fs.readFileSync(rpcCred.cookie).toString().split(':', 2);
	
	if (!rpcCred.password) {
		throw new Error(`Cookie file ${rpcCred.cookie} in unexpected format`);
	}
}

var cookieSecret = process.env.BGEXP_COOKIE_SECRET
 || (rpcCred.password && crypto.createHmac('sha256', JSON.stringify(rpcCred))
                               .update('glob-rpc-explorer-cookie-secret').digest('hex'))
 || "0x000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f";


var electrumXServerUriStrings = (process.env.BGEXP_ELECTRUMX_SERVERS || "").split(',').filter(Boolean);
var electrumXServers = [];
for (var i = 0; i < electrumXServerUriStrings.length; i++) {
	var uri = url.parse(electrumXServerUriStrings[i]);
	
	electrumXServers.push({protocol:uri.protocol.substring(0, uri.protocol.length - 1), host:uri.hostname, port:parseInt(uri.port)});
}

// default=false env vars
[
	"BGEXP_DEMO",
	"BGEXP_PRIVACY_MODE",
	"BGEXP_NO_INMEMORY_RPC_CACHE",
	"BGEXP_RPC_ALLOWALL"

].forEach(function(item) {
	if (process.env[item] === undefined) {
		process.env[item] = "false";

		debugLog(`Config(default): ${item}=false`)
	}
});


// default=true env vars
[
	"BGEXP_NO_RATES",
	"BGEXP_UI_SHOW_TOOLS_SUBHEADER",
	"BGEXP_SLOW_DEVICE_MODE"

].forEach(function(item) {
	if (process.env[item] === undefined) {
		process.env[item] = "true";

		debugLog(`Config(default): ${item}=true`)
	}
});

module.exports = {
	coin: currentCoin,

	cookieSecret: cookieSecret,

	privacyMode: (process.env.BGEXP_PRIVACY_MODE.toLowerCase() == "true"),
	slowDeviceMode: (process.env.BGEXP_SLOW_DEVICE_MODE.toLowerCase() == "true"),
	demoSite: (process.env.BGEXP_DEMO.toLowerCase() == "true"),
	queryExchangeRates: (process.env.BGEXP_NO_RATES.toLowerCase() != "true"),
	noInmemoryRpcCache: (process.env.BGEXP_NO_INMEMORY_RPC_CACHE.toLowerCase() == "true"),
	
	rpcConcurrency: (process.env.BGEXP_RPC_CONCURRENCY || 10),

	rpcBlacklist:
	  process.env.BGEXP_RPC_ALLOWALL.toLowerCase() == "true"  ? []
	: process.env.BGEXP_RPC_BLACKLIST ? process.env.BGEXP_RPC_BLACKLIST.split(',').filter(Boolean)
	: [
		"addnode",
		"backupwallet",
		"bumpfee",
		"clearbanned",
		"createmultisig",
		"createwallet",
		"disconnectnode",
		"dumpprivkey",
		"dumpwallet",
		"encryptwallet",
		"generate",
		"generatetoaddress",
		"getaccountaddrss",
		"getaddressesbyaccount",
		"getbalance",
		"getnewaddress",
		"getrawchangeaddress",
		"getreceivedbyaccount",
		"getreceivedbyaddress",
		"gettransaction",
		"getunconfirmedbalance",
		"getwalletinfo",
		"importaddress",
		"importmulti",
		"importprivkey",
		"importprunedfunds",
		"importpubkey",
		"importwallet",
		"invalidateblock",
		"keypoolrefill",
		"listaccounts",
		"listaddressgroupings",
		"listlockunspent",
		"listreceivedbyaccount",
		"listreceivedbyaddress",
		"listsinceblock",
		"listtransactions",
		"listunspent",
		"listwallets",
		"lockunspent",
		"logging",
		"move",
		"preciousblock",
		"pruneblockchain",
		"reconsiderblock",
		"removeprunedfunds",
		"rescanblockchain",
		"savemempool",
		"sendfrom",
		"sendmany",
		"sendtoaddress",
		"sendrawtransaction",
		"setaccount",
		"setban",
		"setmocktime",
		"setnetworkactive",
		"signmessage",
		"signmessagewithprivatekey",
		"signrawtransaction",
		"signrawtransactionwithkey",
		"stop",
		"submitblock",
		"syncwithvalidationinterfacequeue",
		"verifychain",
		"waitforblock",
		"waitforblockheight",
		"waitfornewblock",
		"walletlock",
		"walletpassphrase",
		"walletpassphrasechange",
	],

	addressApi:process.env.BGEXP_ADDRESS_API,
	electrumXServers:electrumXServers,

	redisUrl:process.env.BGEXP_REDIS_URL,

	site: {
		homepage:{
			recentBlocksCount:10
		},
		blockTxPageSize:20,
		addressTxPageSize:10,
		txMaxInput:15,
		browseBlocksPageSize:50,
		addressPage:{
			txOutputMaxDefaultDisplay:10
		},
		valueDisplayMaxLargeDigits: 4,
		header:{
			showToolsSubheader:(process.env.BGEXP_UI_SHOW_TOOLS_SUBHEADER == "true"),
			dropdowns:[
				{
					title:"Related Sites",
					links:[
						{name: "Bitcoin Global", url:"https://mainnet.bitcoin-global.io", imgUrl:"/img/logo/bg.png"},
						{name: "Bitcoin Global Testnet", url:"https://testnet.bitcoin-global.io", imgUrl:"/img/logo/tbg.png"},
					]
				}
			]
		},
		subHeaderToolsList:[0, 10, 9, 4, 11, 6, 7], // indexes in "siteTools" below that are shown in the site "sub menu" (visible on all pages except homepage)
		prioritizedToolIdsList: [0, 10, 11, 9, 3, 4, 12, 2, 5, 1, 6, 7, 8],
	},

	credentials: credentials,

	siteTools:[
	/* 0 */		{name:"Node Status", url:"/node-status", desc:"Summary of this node: version, network, uptime, etc.", fontawesome:"fas fa-broadcast-tower"},
	/* 1 */		{name:"Peers", url:"/peers", desc:"Detailed info about the peers connected to this node.", fontawesome:"fas fa-sitemap"},

	/* 2 */		{name:"Browse Blocks", url:"/blocks", desc:"Browse all blocks in the blockchain.", fontawesome:"fas fa-cubes"},
	/* 3 */		{name:"Transaction Stats", url:"/tx-stats", desc:"See graphs of total transaction volume and transaction rates.", fontawesome:"fas fa-chart-bar"},

	/* 4 */		{name:"Mempool Summary", url:"/mempool-summary", desc:"Detailed summary of the current mempool for this node.", fontawesome:"fas fa-receipt"},
	/* 5 */		{name:"Browse Pending Tx", url:"/unconfirmed-tx", desc:"Browse unconfirmed/pending transactions.", fontawesome:"fas fa-unlock"},

	/* 6 */		{name:"RPC Browser", url:"/rpc-browser", desc:"Browse the RPC functionality of this node. See docs and execute commands.", fontawesome:"fas fa-book"},
	/* 7 */		{name:"RPC Terminal", url:"/rpc-terminal", desc:"Directly execute RPCs against this node.", fontawesome:"fas fa-terminal"},

	/* 8 */		{name:(coins[currentCoin].name + " Fun"), url:"/fun", desc:"See fun/interesting historical blockchain data.", fontawesome:"fas fa-certificate"},

	/* 9 */		{name:"Mining Summary", url:"/mining-summary", desc:"Summary of recent data about miners.", fontawesome:"fas fa-chart-pie"},
	/* 10 */	{name:"Block Stats", url:"/block-stats", desc:"Summary data for blocks in configurable range.", fontawesome:"fas fa-layer-group"},
	/* 11 */	{name:"Block Analysis", url:"/block-analysis", desc:"Summary analysis for all transactions in a block.", fontawesome:"fas fa-angle-double-down"},
	/* 12 */	{name:"Difficulty History", url:"/difficulty-history", desc:"Graph of difficulty changes over time.", fontawesome:"fas fa-chart-line"},
	],

	donations:{
		addresses:{
			coins:["BG"],
			sites:{"BG":"https://explorer.bitcoin-global.io"}
		}
	}
};

debugLog(`Config(final): privacyMode=${module.exports.privacyMode}`);
debugLog(`Config(final): slowDeviceMode=${module.exports.slowDeviceMode}`);
debugLog(`Config(final): demo=${module.exports.demoSite}`);
debugLog(`Config(final): rpcAllowAll=${module.exports.rpcBlacklist.length == 0}`);
