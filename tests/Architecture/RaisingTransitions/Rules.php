<?php

declare(strict_types=1);

/**
 * The Rules transitions that raise facts, each called only inside a unit: a command handler, a transaction listener
 * or a model (ModelRaiseCallerTest).
 */
return [
    'Rule::approveBy',
    'Rule::deny',
    'Rule::remove',
];
