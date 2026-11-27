<?php

declare(strict_types=1);

namespace App\Stacks\Contracts;

use App\Stacks\References\StateReference;
use App\Values\StackTarget;

/**
 * Builds a base state of a session's stack, one that config/journal.php names in sessions.base_states.
 */
interface BaseStateReference
{
    /**
     * The reference of this base state on one session's stack.
     */
    public static function forSession(StackTarget $target): StateReference;
}
