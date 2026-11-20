<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Hooks\Declarations\StateMethod;
use App\Hooks\Enums\SelectionReason;

/**
 * A method selected on one live frame of the starting snapshot.
 */
final readonly class SelectedStateMethod
{
    public function __construct(
        public Frame $frame,
        public StateMethod $method,
        public SelectionReason $reason,
    ) {}
}
