'use strict';

var window = {};

(function(w){

    // Check for definition
    if(typeof(w.ethWallet) !== 'undefined'){
        console.log('Ethereum wallet is already defined.');
        return false;
    }

    // Required modules
    var Bip39 = require('bip39');
    var HDKey = require('ethereumjs-wallet/hdkey')
    var Wallet = require('ethereumjs-wallet');
    
    // Define ethWallet object
    var _ethWallet = {
        mist: {
            /**
             * Private wallet instance
             * @private  wallet
             */
            _wallet: null,
            /**
             * Open V1 wallet
             * @param {string} strJson Input v1 mist wallet key file
             * @param {string} password Password
             * @return {object} Wallet object
             */
            fromV1: function(strJson, password){
                this._wallet = Wallet.fromV1(strJson, password); 
                return this._wallet;
            },
            /**
             * Open V3 wallet
             * @param {string} strJson Input v3 mist wallet key file
             * @param {string} password Password
             * @return {object} Wallet object
             */
            fromV3: function(){
                this._wallet = Wallet.fromV3(strJson, password); 
                return this._wallet;
            },
            /**
             * Export to V3 wallet
             * @param {object} wallet object
             * @param {string} password
             * @return {string}
             */
            toV3: function(wallet, password){
                return wallet.toV3String(password);
            },
            /**
             * Clear private key & public key
             */
            clear: function(){
                this._wallet.privKey.fill(0x0);
                this._wallet.pubKey.fill(0x0);
                this._wallet = null;
            }
        },
        hd:{
            /**
             * Private wallet instance
             * @private  wallet
             */
            _wallet: null,
            /**
             * Restore wallet from seed
             * @param {string} passphrase
             * @param {string} path
             * @param {integer} child
             * @return {object} Wallet object  
             */
            fromSeed: function(passphrase, path, child){
                var masterSeed = Bip39.mnemonicToSeed(passphrase);
                this._wallet = HDKey.fromMasterSeed(masterSeed).derivePath("m/44'/60'/0'/0").deriveChild(0).getWallet();
                return this._wallet;
            },
            /**
             * Generate passphrase
             * @return {string} 12 words passphrase
             */
            generate: function(){
                return Bip39.generateMnemonic();
            },
            /**
             * Validate seed
             * @param passphrase {string}
             * @return {bool}
             */
            validate: function(passphrase){
                return Bip39.validateMnemonic(passphrase);
            },
            /**
             * Convert from passphrase to master seed
             * @param passphrase {string}
             * @return {Buffer} Master seed
             */
            master: function(passphrase){
                return  Bip39.mnemonicToSeed(passphrase);
            },
            /**
             * Clear private key & public key
             */
            clear: function(){
                this._wallet.privKey.fill(0x0);
                this._wallet.pubKey.fill(0x0);
                this._wallet = null;
            }
        }
    };

    // Provide global object
    w.ethWallet = _ethWallet;

})(window);