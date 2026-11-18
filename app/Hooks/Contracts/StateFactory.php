<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Hooks\Decisions\StateReference;
use App\Hooks\Stack\Frame;

/**
 * Builds the frame for a state reference, with a new frame id, from the registered state types.
 */
interface StateFactory
{
    public function frameFor(StateReference $reference): Frame;
}
