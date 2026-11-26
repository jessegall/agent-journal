<?php

declare(strict_types=1);

namespace App\Stacks\Contracts;

use App\Stacks\Frames\Frame;
use App\Stacks\References\StateReference;

/**
 * Builds the frame for a state reference, with a new frame id, from the registered state types.
 */
interface StateFactory
{
    /**
     * A new frame for the pushed reference, its state built from the first values the reference carries.
     */
    public function frameFor(StateReference $reference): Frame;

    /**
     * Whether the reference's state type runs now; an unknown type is an error. Asked before any subject is read.
     */
    public function isEnabled(StateReference $reference): bool;
}
