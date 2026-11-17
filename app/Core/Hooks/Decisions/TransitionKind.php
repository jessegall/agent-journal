<?php

declare(strict_types=1);

namespace App\Core\Hooks\Decisions;

/**
 * The kind of stack transition a state asked for, as the walk records it.
 */
enum TransitionKind: string
{
    case Keep = 'keep';
    case PopSelf = 'pop_self';
    case Push = 'push';
}
