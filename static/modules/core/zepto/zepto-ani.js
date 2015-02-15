define(function(require,exports,module){

    var  Zepto = require("$");
    var jQuery = Zepto;




    ;(function($){

        // jQuery Data object
        var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
            rmultiDash = /([A-Z])/g,
            expando = "Zepto" + ( '1.0' + Math.random() ).replace( /\D/g, ""),
            optionsCache = {},
            core_rnotwhite = /\S+/g,
            core_deletedIds = [],
            core_push = core_deletedIds.push;

// Convert String-formatted options into Object-formatted ones and store in cache
        function createOptions( options ) {
            var object = optionsCache[ options ] = {};
            $.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
                object[ flag ] = true;
            });
            return object;
        }

        function isArraylike( obj ) {
            var length = obj.length,
                type = $.type( obj );

            if ( $.isWindow( obj ) ) {
                return false;
            }

            if ( obj.nodeType === 1 && length ) {
                return true;
            }

            return type === "array" || type !== "function" &&
                ( length === 0 ||
                    typeof length === "number" && length > 0 && ( length - 1 ) in obj );
        }

        $.Callbacks = function( options ) {

            // Convert options from String-formatted to Object-formatted if needed
            // (we check in cache first)
            options = typeof options === "string" ?
                ( optionsCache[ options ] || createOptions( options ) ) :
                $.extend( {}, options );

            var // Last fire value (for non-forgettable lists)
                memory,
            // Flag to know if list was already fired
                fired,
            // Flag to know if list is currently firing
                firing,
            // First callback to fire (used internally by add and fireWith)
                firingStart,
            // End of the loop when firing
                firingLength,
            // Index of currently firing callback (modified by remove if needed)
                firingIndex,
            // Actual callback list
                list = [],
            // Stack of fire calls for repeatable lists
                stack = !options.once && [],
            // Fire callbacks
                fire = function( data ) {
                    memory = options.memory && data;
                    fired = true;
                    firingIndex = firingStart || 0;
                    firingStart = 0;
                    firingLength = list.length;
                    firing = true;
                    for ( ; list && firingIndex < firingLength; firingIndex++ ) {
                        if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
                            memory = false; // To prevent further calls using add
                            break;
                        }
                    }
                    firing = false;
                    if ( list ) {
                        if ( stack ) {
                            if ( stack.length ) {
                                fire( stack.shift() );
                            }
                        } else if ( memory ) {
                            list = [];
                        } else {
                            self.disable();
                        }
                    }
                },
            // Actual Callbacks object
                self = {
                    // Add a callback or a collection of callbacks to the list
                    add: function() {
                        if ( list ) {
                            // First, we save the current length
                            var start = list.length;
                            (function add( args ) {
                                $.each( args, function( _, arg ) {
                                    var type = $.type( arg );
                                    if ( type === "function" ) {
                                        if ( !options.unique || !self.has( arg ) ) {
                                            list.push( arg );
                                        }
                                    } else if ( arg && arg.length && type !== "string" ) {
                                        // Inspect recursively
                                        add( arg );
                                    }
                                });
                            })( arguments );
                            // Do we need to add the callbacks to the
                            // current firing batch?
                            if ( firing ) {
                                firingLength = list.length;
                                // With memory, if we're not firing then
                                // we should call right away
                            } else if ( memory ) {
                                firingStart = start;
                                fire( memory );
                            }
                        }
                        return this;
                    },
                    // Remove a callback from the list
                    remove: function() {
                        if ( list ) {
                            $.each( arguments, function( _, arg ) {
                                var index;
                                while( ( index = $.inArray( arg, list, index ) ) > -1 ) {
                                    list.splice( index, 1 );
                                    // Handle firing indexes
                                    if ( firing ) {
                                        if ( index <= firingLength ) {
                                            firingLength--;
                                        }
                                        if ( index <= firingIndex ) {
                                            firingIndex--;
                                        }
                                    }
                                }
                            });
                        }
                        return this;
                    },
                    // Check if a given callback is in the list.
                    // If no argument is given, return whether or not list has callbacks attached.
                    has: function( fn ) {
                        return fn ? $.inArray( fn, list ) > -1 : !!( list && list.length );
                    },
                    // Remove all callbacks from the list
                    empty: function() {
                        list = [];
                        firingLength = 0;
                        return this;
                    },
                    // Have the list do nothing anymore
                    disable: function() {
                        list = stack = memory = undefined;
                        return this;
                    },
                    // Is it disabled?
                    disabled: function() {
                        return !list;
                    },
                    // Lock the list in its current state
                    lock: function() {
                        stack = undefined;
                        if ( !memory ) {
                            self.disable();
                        }
                        return this;
                    },
                    // Is it locked?
                    locked: function() {
                        return !stack;
                    },
                    // Call all callbacks with the given context and arguments
                    fireWith: function( context, args ) {
                        if ( list && ( !fired || stack ) ) {
                            args = args || [];
                            args = [ context, args.slice ? args.slice() : args ];
                            if ( firing ) {
                                stack.push( args );
                            } else {
                                fire( args );
                            }
                        }
                        return this;
                    },
                    // Call all the callbacks with the given arguments
                    fire: function() {
                        self.fireWith( this, arguments );
                        return this;
                    },
                    // To know if the callbacks have already been called at least once
                    fired: function() {
                        return !!fired;
                    }
                };

            return self;
        }

        function Data() {
            // Support: Android < 4,
            // Old WebKit does not have Object.preventExtensions/freeze method,
            // return new empty object instead with no [[set]] accessor
            Object.defineProperty( this.cache = {}, 0, {
                get: function() {
                    return {};
                }
            });

            this.expando = expando + Math.random();
        }

        Data.uid = 1;

        Data.accepts = function( owner ) {
            // Accepts only:
            //  - Node
            //    - Node.ELEMENT_NODE
            //    - Node.DOCUMENT_NODE
            //  - Object
            //    - Any
            return owner.nodeType ?
                owner.nodeType === 1 || owner.nodeType === 9 : true;
        };

        Data.prototype = {
            key: function( owner ) {
                // We can accept data for non-element nodes in modern browsers,
                // but we should not, see #8335.
                // Always return the key for a frozen object.
                if ( !Data.accepts( owner ) ) {
                    return 0;
                }

                var descriptor = {},
                // Check if the owner object already has a cache key
                    unlock = owner[ this.expando ];

                // If not, create one
                if ( !unlock ) {
                    unlock = Data.uid++;

                    // Secure it in a non-enumerable, non-writable property
                    try {
                        descriptor[ this.expando ] = { value: unlock };
                        Object.defineProperties( owner, descriptor );

                        // Support: Android < 4
                        // Fallback to a less secure definition
                    } catch ( e ) {
                        descriptor[ this.expando ] = unlock;
                        $.extend( owner, descriptor );
                    }
                }

                // Ensure the cache object
                if ( !this.cache[ unlock ] ) {
                    this.cache[ unlock ] = {};
                }

                return unlock;
            },
            set: function( owner, data, value ) {
                var prop,
                // There may be an unlock assigned to this node,
                // if there is no entry for this "owner", create one inline
                // and set the unlock as though an owner entry had always existed
                    unlock = this.key( owner ),
                    cache = this.cache[ unlock ];

                // Handle: [ owner, key, value ] args
                if ( typeof data === "string" ) {
                    cache[ data ] = value;

                    // Handle: [ owner, { properties } ] args
                } else {
                    // Fresh assignments by object are shallow copied
                    if ( $.isEmptyObject( cache ) ) {
                        $.extend( this.cache[ unlock ], data );
                        // Otherwise, copy the properties one-by-one to the cache object
                    } else {
                        for ( prop in data ) {
                            cache[ prop ] = data[ prop ];
                        }
                    }
                }
                return cache;
            },
            get: function( owner, key ) {
                // Either a valid cache is found, or will be created.
                // New caches will be created and the unlock returned,
                // allowing direct access to the newly created
                // empty data object. A valid owner object must be provided.
                var cache = this.cache[ this.key( owner ) ];

                return key === undefined ?
                    cache : cache[ key ];
            },
            access: function( owner, key, value ) {
                var stored;
                // In cases where either:
                //
                //   1. No key was specified
                //   2. A string key was specified, but no value provided
                //
                // Take the "read" path and allow the get method to determine
                // which value to return, respectively either:
                //
                //   1. The entire cache object
                //   2. The data stored at the key
                //
                if ( key === undefined ||
                    ((key && typeof key === "string") && value === undefined) ) {

                    stored = this.get( owner, key );

                    return stored !== undefined ?
                        stored : this.get( owner, $.camelCase(key) );
                }

                // [*]When the key is not a string, or both a key and value
                // are specified, set or extend (existing objects) with either:
                //
                //   1. An object of properties
                //   2. A key and value
                //
                this.set( owner, key, value );

                // Since the "set" path can have two possible entry points
                // return the expected data based on which path was taken[*]
                return value !== undefined ? value : key;
            },
            remove: function( owner, key ) {
                var i, name, camel,
                    unlock = this.key( owner ),
                    cache = this.cache[ unlock ];

                if ( key === undefined ) {
                    this.cache[ unlock ] = {};

                } else {
                    // Support array or space separated string of keys
                    if ( $.isArray( key ) ) {
                        // If "name" is an array of keys...
                        // When data is initially created, via ("key", "val") signature,
                        // keys will be converted to camelCase.
                        // Since there is no way to tell _how_ a key was added, remove
                        // both plain key and camelCase key. #12786
                        // This will only penalize the array argument path.
                        name = key.concat( key.map( $.camelCase ) );
                    } else {
                        camel = $.camelCase( key );
                        // Try the string as a key before any manipulation
                        if ( key in cache ) {
                            name = [ key, camel ];
                        } else {
                            // If a key with the spaces exists, use it.
                            // Otherwise, create an array by matching non-whitespace
                            name = camel;
                            name = name in cache ?
                                [ name ] : ( name.match( core_rnotwhite ) || [] );
                        }
                    }

                    i = name.length;
                    while ( i-- ) {
                        delete cache[ name[ i ] ];
                    }
                }
            },
            hasData: function( owner ) {
                return !$.isEmptyObject(
                        this.cache[ owner[ this.expando ] ] || {}
                );
            },
            discard: function( owner ) {
                if ( owner[ this.expando ] ) {
                    delete this.cache[ owner[ this.expando ] ];
                }
            }
        };

        var data_priv = new Data();

        $.extend($, {
            queue: function( elem, type, data ) {
                var queue;

                if ( elem ) {
                    type = ( type || "fx" ) + "queue";
                    queue = data_priv.get( elem, type );

                    // Speed up dequeue by getting out quickly if this is just a lookup
                    if ( data ) {
                        if ( !queue || $.isArray( data ) ) {
                            queue = data_priv.access( elem, type, $.makeArray(data) );
                        } else {
                            queue.push( data );
                        }
                    }
                    return queue || [];
                }
            },

            dequeue: function( elem, type ) {
                type = type || "fx";

                var queue = $.queue( elem, type ),
                    startLength = queue.length,
                    fn = queue.shift(),
                    hooks = $._queueHooks( elem, type ),
                    next = function() {
                        $.dequeue( elem, type );
                    };

                // If the fx queue is dequeued, always remove the progress sentinel
                if ( fn === "inprogress" ) {
                    fn = queue.shift();
                    startLength--;
                }

                if ( fn ) {

                    // Add a progress sentinel to prevent the fx queue from being
                    // automatically dequeued
                    if ( type === "fx" ) {
                        queue.unshift( "inprogress" );
                    }

                    // clear up the last queue stop function
                    delete hooks.stop;
                    fn.call( elem, next, hooks );
                }

                if ( !startLength && hooks ) {
                    hooks.empty.fire();
                }
            },

            // not intended for public consumption - generates a queueHooks object, or returns the current one
            _queueHooks: function( elem, type ) {
                var key = type + "queueHooks";
                return data_priv.get( elem, key ) || data_priv.access( elem, key, {
                    empty: $.Callbacks("once memory").add(function() {
                        data_priv.remove( elem, [ type + "queue", key ] );
                    })
                });
            },

            // array operations
            makeArray: function( arr, results ) {
                var ret = results || [];

                if ( arr != null ) {
                    if ( isArraylike( Object(arr) ) ) {
                        $.merge( ret,
                                typeof arr === "string" ?
                                [ arr ] : arr
                        );
                    } else {
                        core_push.call( ret, arr );
                    }
                }

                return ret;
            },
            merge: function( first, second ) {
                var l = second.length,
                    i = first.length,
                    j = 0;

                if ( typeof l === "number" ) {
                    for ( ; j < l; j++ ) {
                        first[ i++ ] = second[ j ];
                    }
                } else {
                    while ( second[j] !== undefined ) {
                        first[ i++ ] = second[ j++ ];
                    }
                }

                first.length = i;

                return first;
            }
        });

        $.extend($.fn, {
            queue: function( type, data ) {
                var setter = 2;

                if ( typeof type !== "string" ) {
                    data = type;
                    type = "fx";
                    setter--;
                }

                if ( arguments.length < setter ) {
                    return $.queue( this[0], type );
                }

                return data === undefined ?
                    this :
                    this.each(function() {
                        var queue = $.queue( this, type, data );

                        // ensure a hooks for this queue
                        $._queueHooks( this, type );

                        if ( type === "fx" && queue[0] !== "inprogress" ) {
                            $.dequeue( this, type );
                        }
                    });
            },
            dequeue: function( type ) {
                return this.each(function() {
                    $.dequeue( this, type );
                });
            },
            // Based off of the plugin by Clint Helfers, with permission.
            // http://blindsignals.com/index.php/2009/07/jquery-delay/
            delay: function( time, type ) {
                time = $.fx ? $.fx.speeds[ time ] || time : time;
                type = type || "fx";

                return this.queue( type, function( next, hooks ) {
                    var timeout = setTimeout( next, time );
                    hooks.stop = function() {
                        clearTimeout( timeout );
                    };
                });
            },
            clearQueue: function( type ) {
                return this.queue( type || "fx", [] );
            },
            // Get a promise resolved when queues of a certain type
            // are emptied (fx is the type by default)
            promise: function( type, obj ) {
                var tmp,
                    count = 1,
                    defer = $.Deferred(),
                    elements = this,
                    i = this.length,
                    resolve = function() {
                        if ( !( --count ) ) {
                            defer.resolveWith( elements, [ elements ] );
                        }
                    };

                if ( typeof type !== "string" ) {
                    obj = type;
                    type = undefined;
                }
                type = type || "fx";

                while( i-- ) {
                    tmp = data_priv.get( elements[ i ], type + "queueHooks" );
                    if ( tmp && tmp.empty ) {
                        count++;
                        tmp.empty.add( resolve );
                    }
                }
                resolve();
                return defer.promise( obj );
            }
        });

    }(Zepto));

    ;(function($, undefined){




        function Animation( elem, properties, options ) {
            var result,
                stopped,
                index = 0,
                length = animationPrefilters.length,
                deferred = jQuery.Deferred().always( function() {
                    // don't match elem in the :animated selector
                    delete tick.elem;
                }),
                tick = function() {
                    if ( stopped ) {
                        return false;
                    }
                    var currentTime = fxNow || createFxNow(),
                        remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
                    // archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
                        temp = remaining / animation.duration || 0,
                        percent = 1 - temp,
                        index = 0,
                        length = animation.tweens.length;

                    for ( ; index < length ; index++ ) {
                        animation.tweens[ index ].run( percent );
                    }

                    deferred.notifyWith( elem, [ animation, percent, remaining ]);

                    if ( percent < 1 && length ) {
                        return remaining;
                    } else {
                        deferred.resolveWith( elem, [ animation ] );
                        return false;
                    }
                },
                animation = deferred.promise({
                    elem: elem,
                    props: jQuery.extend( {}, properties ),
                    opts: jQuery.extend( true, { specialEasing: {} }, options ),
                    originalProperties: properties,
                    originalOptions: options,
                    startTime: fxNow || createFxNow(),
                    duration: options.duration,
                    tweens: [],
                    createTween: function( prop, end ) {
                        var tween = jQuery.Tween( elem, animation.opts, prop, end,
                                animation.opts.specialEasing[ prop ] || animation.opts.easing );
                        animation.tweens.push( tween );
                        return tween;
                    },
                    stop: function( gotoEnd ) {
                        var index = 0,
                        // if we are going to the end, we want to run all the tweens
                        // otherwise we skip this part
                            length = gotoEnd ? animation.tweens.length : 0;
                        if ( stopped ) {
                            return this;
                        }
                        stopped = true;
                        for ( ; index < length ; index++ ) {
                            animation.tweens[ index ].run( 1 );
                        }

                        // resolve when we played the last frame
                        // otherwise, reject
                        if ( gotoEnd ) {
                            deferred.resolveWith( elem, [ animation, gotoEnd ] );
                        } else {
                            deferred.rejectWith( elem, [ animation, gotoEnd ] );
                        }
                        return this;
                    }
                }),
                props = animation.props;

            propFilter( props, animation.opts.specialEasing );

            for ( ; index < length ; index++ ) {
                result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
                if ( result ) {
                    return result;
                }
            }

            createTweens( animation, props );

            if ( jQuery.isFunction( animation.opts.start ) ) {
                animation.opts.start.call( elem, animation );
            }

            jQuery.fx.timer(
                jQuery.extend( tick, {
                    elem: elem,
                    anim: animation,
                    queue: animation.opts.queue
                })
            );

            // attach callbacks from options
            return animation.progress( animation.opts.progress )
                .done( animation.opts.done, animation.opts.complete )
                .fail( animation.opts.fail )
                .always( animation.opts.always );
        }



        jQuery.speed = function( speed, easing, fn ) {
            var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
                complete: fn || !fn && easing ||
                    jQuery.isFunction( speed ) && speed,
                duration: speed,
                easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
            };

            opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
                    opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

            // normalize opt.queue - true/undefined/null -> "fx"
            if ( opt.queue == null || opt.queue === true ) {
                opt.queue = "fx";
            }

            // Queueing
            opt.old = opt.complete;

            opt.complete = function() {
                if ( jQuery.isFunction( opt.old ) ) {
                    opt.old.call( this );
                }

                if ( opt.queue ) {
                    jQuery.dequeue( this, opt.queue );
                }
            };

            return opt;
        };

        jQuery.easing = {
            linear: function( p ) {
                return p;
            },
            swing: function( p ) {
                return 0.5 - Math.cos( p*Math.PI ) / 2;
            }
        };



        function Tween( elem, options, prop, end, easing ) {
            return new Tween.prototype.init( elem, options, prop, end, easing );
        }
        jQuery.Tween = Tween;

        Tween.prototype = {
            constructor: Tween,
            init: function( elem, options, prop, end, easing, unit ) {
                this.elem = elem;
                this.prop = prop;
                this.easing = easing || "swing";
                this.options = options;
                this.start = this.now = this.cur();
                this.end = end;
                this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
            },
            cur: function() {
                var hooks = Tween.propHooks[ this.prop ];

                return hooks && hooks.get ?
                    hooks.get( this ) :
                    Tween.propHooks._default.get( this );
            },
            run: function( percent ) {
                var eased,
                    hooks = Tween.propHooks[ this.prop ];

                if ( this.options.duration ) {
                    this.pos = eased = jQuery.easing[ this.easing ](
                        percent, this.options.duration * percent, 0, 1, this.options.duration
                    );
                } else {
                    this.pos = eased = percent;
                }
                this.now = ( this.end - this.start ) * eased + this.start;

                if ( this.options.step ) {
                    this.options.step.call( this.elem, this.now, this );
                }

                if ( hooks && hooks.set ) {
                    hooks.set( this );
                } else {
                    Tween.propHooks._default.set( this );
                }
                return this;
            }
        };

        Tween.prototype.init.prototype = Tween.prototype;

        Tween.propHooks = {
            _default: {
                get: function( tween ) {
                    var result;

                    if ( tween.elem[ tween.prop ] != null &&
                        (!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
                        return tween.elem[ tween.prop ];
                    }

                    // passing an empty string as a 3rd parameter to .css will automatically
                    // attempt a parseFloat and fallback to a string if the parse fails
                    // so, simple values such as "10px" are parsed to Float.
                    // complex values such as "rotate(1rad)" are returned as is.
                    result = jQuery.css( tween.elem, tween.prop, "" );
                    // Empty strings, null, undefined and "auto" are converted to 0.
                    return !result || result === "auto" ? 0 : result;
                },
                set: function( tween ) {
                    // use step hook for back compat - use cssHook if its there - use .style if its
                    // available and use plain properties where available
                    if ( jQuery.fx.step[ tween.prop ] ) {
                        jQuery.fx.step[ tween.prop ]( tween );
                    } else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
                        jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
                    } else {
                        tween.elem[ tween.prop ] = tween.now;
                    }
                }
            }
        };

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

        Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
            set: function( tween ) {
                if ( tween.elem.nodeType && tween.elem.parentNode ) {
                    tween.elem[ tween.prop ] = tween.now;
                }
            }
        };


        jQuery.fx = Tween.prototype.init;



        $.fn.animate = function( prop, speed, easing, callback ) {
            var empty = $.isEmptyObject( prop ),
                optall = $.speed( speed, easing, callback ),
                doAnimation = function() {
                    // Operate on a copy of prop so per-property easing won't be lost
                    var anim = Animation( this, $.extend( {}, prop ), optall );
                    doAnimation.finish = function() {
                        anim.stop( true );
                    };
                    // Empty animations, or finishing resolves immediately
                    if ( empty || $._data( this, "finish" ) ) {
                        anim.stop( true );
                    }
                };
            doAnimation.finish = doAnimation;

            return empty || optall.queue === false ?
                this.each( doAnimation ) :
                this.queue( optall.queue, doAnimation );
        }


    })(Zepto);


});



