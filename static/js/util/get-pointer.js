/* ==========================================================================
 * get-pointer.js
 * 
 *  Script to setup pointer / mouse lock. Handles interaction with freeze
 *  frame BEFORE game begins
 *
 * ========================================================================== */
var events = require('../events');

module.exports = function getPointer(){
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    var instructions = document.getElementById( 'instructions' );
    var blocker = document.getElementById( 'blocker' );
    var element = document.body;

    if ( havePointerLock ) {
        var pointerlockchange = function pointerLockChange ( event ) {
            if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
                events.emit('game:controls:enabled', true);
                blocker.style.display = 'none';

            } else {
                events.emit('game:controls:enabled', false);
                instructions.style.display = '';
            }
        };

        var pointerlockerror = function ( event ) {
            instructions.style.display = '';
            alert('Error getting pointer');
        };

        // Hook pointer lock state change events
        document.addEventListener( 'pointerlockchange', pointerlockchange, false );
        document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
        document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

        document.addEventListener( 'pointerlockerror', pointerlockerror, false );
        document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
        document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

        instructions.addEventListener( 'click', function ( event ) {
            instructions.style.display = 'none';

            // Ask the browser to lock the pointer
            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
            if (/Firefox/i.test( navigator.userAgent ) ) {
                var fullscreenchange = function fullScreenChange ( event ) {
                    if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
                        document.removeEventListener( 'fullscreenchange', fullscreenchange );
                        document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
                        element.requestPointerLock();
                    }
                };
                document.addEventListener( 'fullscreenchange', fullscreenchange, false );
                document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
                element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
                element.requestFullscreen();
            } else {
                element.requestPointerLock();
            }
        }, false );

    } else {
        instructions.style.display = 'block';
    }

    document.addEventListener("visibilitychange", function() {
        if(document.visibilityState){ blocker.style.display = 'block'; }
    });
    document.addEventListener("blur", function() {
        if(document.visibilityState){ blocker.style.display = 'block'; }
    });
};
