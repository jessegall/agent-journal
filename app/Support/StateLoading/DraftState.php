<?php

declare(strict_types=1);

namespace App\Support\StateLoading;

use App\Support\States\AgentState;

/**
 * A state the container just made, with the data properties its constructor did not take still to fill in.
 */
final readonly class DraftState
{
    /**
     * @param  array<string, mixed>  $propertyValues
     */
    public function __construct(
        public RegisteredStateType $type,
        public AgentState $state,
        public array $propertyValues,
    ) {}
}
