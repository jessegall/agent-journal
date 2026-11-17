<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Stack;

use App\Domain\Hooks\Decisions\StateReference;

/**
 * Builds the frame for a state reference, with a new frame id, from the registered state types.
 */
interface StateFactory
{
    public function frameFor(StateReference $reference): Frame;
}
