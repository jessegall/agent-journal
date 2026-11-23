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
use Closure;
use Illuminate\Contracts\Container\Container;

/**
 * Builds the ready bottom of a stack for the agent acting now, with what its profile lets it change. The loader lives
 * as long as its worker, so it asks for the container of the request in hand at each call and keeps none: a kept one
 * would judge every later request by a request that is over, with no actor.
 */
final readonly class ReadyStateLoader implements StateLoader
{
    /**
     * @param  Closure(): Container  $containerOfRequest
     */
    public function __construct(private Closure $containerOfRequest) {}

    public function stateClass(): string
    {
        return ReadyState::class;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        $container = ($this->containerOfRequest)();

        return StateSet::build($references, fn () => new ReadyState(
            $container->make(OperationPolicy::class),
            $container->make(StopConditionGate::class),
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
