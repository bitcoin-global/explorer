# Bitcoin Global RPC Explorer

![homepage](https://github.com/bitcoin-global/explorer/blob/master/public/img/screenshots/homepage.png?raw=true)

Simple, database-free Bitcoin Global blockchain explorer, driven by RPC calls to your own [Bitglobal](https://github.com/bitcoin-global/bitcoin-global) node. It is easy to run and can be connected to other tools (like [ElectrumX](https://github.com/spesmilo/electrumx)) to achieve a full-featured explorer.      

Whatever reasons one may have for running a full node (trustlessness, technical curiosity, supporting the network, etc) it's helpful to appreciate the "fullness" of your node. With this explorer, you can explore not just the blockchain database, but also explore the functional capabilities of your own node.

Live demo available at: 
* [https://testnet.bitcoin-global.io](https://testnet.bitcoin-global.io)
* [https://mainnet.bitcoin-global.io](https://mainnet.bitcoin-global.io)

# Features
* Network Summary dashboard
* View details of blocks, transactions, and addresses
* Analysis tools for viewing stats on blocks, transactions, and miner activity
* See raw JSON content from bitglobd used to generate most pages
* Search by transaction ID, block hash/height, and address
* Optional transaction history for addresses by querying from ElectrumX, blockchain.com, blockchair.com, or blockcypher.com
* Mempool summary, with fee, size, and age breakdowns
* RPC command browser and terminal

# Getting started

## Prerequisites
1. Install and run a full, archiving node - [instructions](https://bitcoin-global.io/en/full-node). Ensure that your bitglobal node has full transaction indexing enabled (`txindex=1`) and the RPC server enabled (`server=1`).
2. Synchronize your node with the Bitcoin Global network (you *can* use this tool while your node is still sychronizing, but some pages may fail).
3. Install a "recent" version of Node.js (8+ recommended).

## Install / Run
If you're running on mainnet with the default datadir and port, the default configuration should *Just Work*. Otherwise, see the **Configuration** section below.

#### Run from source:
1. `git clone git@github.com:bitcoin-global/explorer.git`
2. `npm install`
3. `npm start`


Using either method (`npm install` or run from source), after startup open [http://127.0.0.1:3002/](http://127.0.0.1:3002/)


## Configuration
Configuration options may be set via environment variables or CLI arguments.

#### Configuration with environment variables
To configure with environment variables, you need to create one of the 2 following files and enter values in it:

1. `~/.config/glob-rpc-explorer.env`
2. `.env` in the working directory for glob-rpc-explorer

In either case, refer to [.env-sample](.env-sample) for a list of the options and formatting details.

#### Configuration with CLI args
For configuring with CLI arguments, run `./bin/cli.js--help` for the full list of options. An example execution is:

```bash
./bin/cli.js--port 8080 --bitglobd-port 18443 --bitglobd-cookie ~/.bitcoin/regtest/.cookie
```

## Run via Docker
1. `docker build -t glob-rpc-explorer .`
2. `docker run -p 3002:3002 -it glob-rpc-explorer`


## Reverse proxy with HTTPS
See [instructions here](docs/nginx-reverse-proxy.md) for using nginx+certbot (letsencrypt) for an HTTPS-accessible, reverse-proxied site.

# Support
`Note:` This is a fork of [BTC RPC Explorer](https://github.com/janoside/btc-rpc-explorer) with minor modifications to support Bitcoin Global blockchain.     
Please consider supporting the original work at [BTC RPC Explorer](https://github.com/janoside/btc-rpc-explorer). 
