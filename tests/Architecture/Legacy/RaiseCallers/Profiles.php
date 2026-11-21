<?php

declare(strict_types=1);

/**
 * The Profiles transitions that raise facts, each called only inside a unit: a command handler, a required listener
 * or a model (ModelRaiseCallerTest).
 */
return [
    'SignInAttempt::finish',
];
