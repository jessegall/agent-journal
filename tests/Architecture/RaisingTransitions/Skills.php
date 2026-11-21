<?php

declare(strict_types=1);

/**
 * The Skills transitions that raise facts, each called only inside a unit: a command handler, a required listener or
 * a model (ModelRaiseCallerTest).
 */
return [
    'Skill::makeCurrent',
    'Skill::retireBy',
];
