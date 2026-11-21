<?php

declare(strict_types=1);

namespace App\Hooks\States\Support;

use App\Hooks\Contracts\OperationPolicy;
use App\Hooks\Contracts\StateLoader;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
use App\Hooks\Enums\SessionTransferType;
use App\Hooks\States\Contracts\StopConditionGate;
use App\Hooks\States\ReadyState;
use Illuminate\Contracts\Container\Container;

/**
 * Builds the ready bottom of a stack for the agent acting now, with what its profile lets it change.
 */
final readonly class ReadyStateLoader implements StateLoader
{
    public function __construct(private Container $container) {}

    public function stateClass(): string
    {
        return ReadyState::class;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        return StateSet::build($references, fn () => new ReadyState(
            $this->container->make(OperationPolicy::class),
            $this->container->make(StopConditionGate::class),
        ));
    }

    public function schemaVersion(): int
    {
        return 1;
    }

    public function sessionTransfer(): SessionTransferType
    {
        return SessionTransferType::SessionOnly;
    }
}
