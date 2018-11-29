/**
 * @author elser
 * @module tools
 * @version 0.0.1
 */
'use strict';
let reexec = function (str){
        var res = RegExp.prototype.exec.call(this, str);
        if(res) for(var idx in this.groups){
            res[this.groups[idx]] = res[parseInt(idx)];
        }
        return res;
    }
;

const tools = {

    Unique : config => {

        let i = 0;
        const {
            base = 36,
            delim = '',
            counter = '0000',
            ts = 8,
            rnd = 4,
            cased = true,
            prefix = '',
            postfix = ''
        } = config || {}
        const id = {
            ts: base => Date.now().toString(base || 36),
            rnd: base => Math.random().toString(base || 36),
            incr: reset => (typeof reset === 'undefined' || isNaN(reset)
                            ? ++i
                            : (i = reset)),
            zfeel: templ => (id.incr().toString().length >= templ.length
                             ? i.toString(base)
                             : templ.replace( RegExp(`.{${i.toString(base).length}}$`), i.toString(base) )),
            unique: (pref = prefix, post = postfix) => `${
                pref ? pref + delim : ''
            }${
                id.varicase([
                    id.zfeel(counter),
                    id.rnd(base).substr(-rnd, rnd),
                    id.ts(base).substr(-ts, ts)
                ].join(delim))
            }${
                post ? delim + post : ''
            }`,
            varicase: str => {
                if(cased){
                    str = str
                    .split('')
                    .reduce( (newStr, s) => newStr + (
                        Math.random() >= 0.5
                        ? s.toUpperCase()
                        : s.toLowerCase()),
                        ''
                    )
                }
                return str;
            }
        }
        return id
    },

    /*
     * // regular expressions with named groups in which res = /(ab)(varname=[a-z]+)/g.exec('abcde') store 'ab' in res[1] and 'cde' in res[2] and res.varname
     *
     * var res, reng = new tools.RegExpNG(/(count=\d+(?:\.\d+)?)\s*(metric=[a-zа-я]+\.?)/, 'ig');
     * while( res = reng.exec('ботинки: 10 шт.; туфли: 12 шт. (по 2150.50 руб.); крем для обуви: 1.5 л.') ){
     *     console.log(res.count, res.metric);
     * }
     * // 10 шт.
     * // 12 шт.
     * // 2150.50 руб.
     * // 1.5 л.
     */
    RegExpNG : function RegExpNG ( re, flags ) {
        if(re instanceof RegExp) {
            re = /^\/(.+)\/([igm]{,3})?$/g.exec(re.toString())[1];
        }
        var res
        ,   varName
        ,   tre = re
        ,   group = 1
        ,   groups = {}
        ,   gre = /\([^\(\)]+/g
        ;
        while( res = gre.exec(re) ){
            if( !( /\(\?[\:\!\=]/.test(res[0]) ) ){
                if( varName = /\(([a-zA-Z0-9_$]+)=/g.exec(res[0]) ) groups[group.toString()] = varName[1];
                group ++;
            }
        }
        regexp = new RegExp( re.replace(/\([a-zA-Z0-9_$]+=/g, '('), flags );
        regexp.groups = groups;
        regexp.exec = reexec.bind(regexp);
        return regexp;
    },

    /*
     * result = tools.typeDepend.bind(someObject)( someObject.someVariable, {
     *     Object: function( callback ){
     *         // if someVariable is object
     *         // this === someObject if binding used, or tools instead
     *         // if(!!this.async){
     *         //    setTimeout(function(){
     *         //       callback(someResult); // for asyncronouse code
     *         //    }, 100);
     *         // } else {
     *         //   return result; // for syncronouse code
     *         // }
     *     },
     *     RegExp: function( callback ){
     *         // if someVariable is regular expression
     *     },
     *     // and other standart types: Array, Number, Function, String, Buffer, etc.
     *
     *     SomeCoolClass: function( callback ){
     *         // if someVariable is instance of SomeCoolClass
     *         // NOTE: someVariable.constructor.name must be equal to the 'SomeCoolClass', function for Object type will be executed instead
     *     },
     *     default: function( callback ){
     *         // default handler, if type doesnt specified in the types argument
     *     }
     * }, function callback(result){
     *     // generaly result processing for asyncronouse or syncronouse code
     * })
     */
    typeDepend : function ( variable, types, callback ) {
        var args = Array.prototype.slice.apply( arguments, 2 )
        ,   self = this
        ,   cb = function(){
                if(callback) {
                    return callback.apply( self, Array.prototype.slice.apply( arguments, 0 ));
                }
            }
        ,   res
        ;
        if( !!variable && !!variable.constructor && !!types[ variable.constructor.name ] ) {
            return types[ variable.constructor.name ].call( this, cb );
        } else if(!!types['default']) {
            return types['default'].call(this, cb);
        } else return cb.call(this, null);
    }
}

module.exports = tools;
