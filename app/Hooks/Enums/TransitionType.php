<?php

declare(strict_types=1);

namespace App\Hooks\Enums;

/**
 * The type of stack transition a state asked for, as the walk records it.
 */
enum TransitionType: string
{
    case Keep = 'keep';
    case PopSelf = 'pop_self';
    case Push = 'push';
}
