<?php

declare(strict_types=1);

namespace App\Support\Stack;

use App\Contracts\Work\WorkOccurrenceGuard;
use App\Events\StateTypesRequested;
use App\Support\StateCatalog\Contracts\StateTypes as StateTypesContract;
use App\Support\StateCatalog\StateTypeRegistry;
use App\Support\StateLoading\Loaders\ReadyStateLoader;
use App\Support\States\ReadyState;
use App\Support\Ticks\TickingTypes;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Builds the state type registry on first use, once per worker, and keeps it; a build that fails is tried again next
 * time.
 */
final class StateTypes implements StateTypesContract
{
    private StateTypeRegistry|null $registry = null;

    public function __construct(
        private readonly Dispatcher $events,
        private ReadyStateLoader $readyStates,
    ) {}

    public function registrationSnapshot(): StateTypeRegistry
    {
        return $this->registry ?? $this->build();
    }

    public function registry(): StateTypeRegistry
    {
        return $this->registry ??= $this->build();
    }

    /**
     * The guard that checks the work of a ticking state type is still live.
     */
    public function occurrenceGuardOf(string $typeKey): WorkOccurrenceGuard
    {
        return $this->registry()->tickingType($typeKey)->occurrenceGuard();
    }

    public function ticking(): TickingTypes
    {
        return new TickingTypes($this->registry()->tickingTypeKeys());
    }

    private function build(): StateTypeRegistry
    {
        $registry = new StateTypeRegistry();

        $registry->register(ReadyState::TYPE_KEY, $this->readyStates);

        $this->events->dispatch(new StateTypesRequested($registry));
        $registry->freeze();

        return $registry;
    }
}
