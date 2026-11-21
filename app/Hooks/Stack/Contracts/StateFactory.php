<?php

declare(strict_types=1);

namespace App\Hooks\Stack\Contracts;

use App\Agents\Values\StackTarget;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Stack\Frame;

/**
 * Builds the frame for a state reference, with a new frame id, from the registered state types.
 */
interface StateFactory
{
    public function frameFor(StateReference $reference, StackTarget $target): Frame;

    /**
     * Whether the reference's state type runs now; an unknown type is an error. Asked before any subject is read.
     */
    public function isEnabled(StateReference $reference): bool;
}
