<?php

declare(strict_types=1);

/**
 * The Chat transitions that raise facts, each called only inside a unit: a command handler, a required listener or a
 * model (ModelRaiseCallerTest).
 */
return [
    'DockPlacement::create',
    'DockPlacement::remove',
];
