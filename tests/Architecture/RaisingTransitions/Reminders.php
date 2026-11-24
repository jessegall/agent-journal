<?php

declare(strict_types=1);

/**
 * The Reminders transitions that raise facts, each called only inside a unit: a command handler, a transaction listener
 * or a model (ModelRaiseCallerTest).
 */
return [
    'Reminder::finish',
];
