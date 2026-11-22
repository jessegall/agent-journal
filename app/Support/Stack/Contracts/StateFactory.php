<?php

declare(strict_types=1);

namespace App\Support\Stack\Contracts;

use App\Support\References\StateReference;
use App\Support\Stack\Frames\Frame;
use App\Values\StackTarget;

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
