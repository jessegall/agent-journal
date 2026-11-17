<?php

declare(strict_types=1);

namespace App\Core\Hooks\Decisions;

/**
 * The kind of stack change a state asked for, as the walk records it.
 */
enum ChangeKind: string
{
    case Keep = 'keep';
    case PopSelf = 'pop_self';
    case Push = 'push';
}
