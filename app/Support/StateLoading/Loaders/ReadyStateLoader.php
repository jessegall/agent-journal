<?php

declare(strict_types=1);

namespace App\Support\StateLoading\Loaders;

use App\Contracts\Authorization\OperationPolicy;
use App\Enums\SessionTransferType;
use App\Support\Decisions\StateReferences;
use App\Support\StateLoading\Contracts\StateLoader;
use App\Support\StateLoading\StateSet;
use App\Support\States\Contracts\StopConditionGate;
use App\Support\States\ReadyState;
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
