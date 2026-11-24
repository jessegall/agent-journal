<?php

declare(strict_types=1);

/**
 * The Web transitions that raise facts, each called only inside a unit: a command handler, a transaction listener
 * or a model (ModelRaiseCallerTest).
 */
return [
    'DeskPreference::switchTo',
    'DeskRecord::advanceSeating',
    'DeskRecord::rename',
];
