<?php

declare(strict_types=1);

namespace App\Support\StateLoading;

use App\Stacks\AgentState;

/**
 * A state built from its values, every data property in place.
 */
final readonly class BuiltState
{
    public function __construct(public AgentState $state) {}
}
