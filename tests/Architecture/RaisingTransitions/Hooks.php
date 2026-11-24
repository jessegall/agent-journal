<?php

declare(strict_types=1);

/**
 * The Hooks transitions that raise facts, each called only inside a unit: a command handler, a transaction listener
 * or a model (ModelRaiseCallerTest).
 */
return [
    'HookCall::recordFor',
];
