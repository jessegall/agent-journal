<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Hooks\Contracts\ResolvesStateTypes;
use App\Hooks\Contracts\WorkOccurrenceGuard;
use App\Hooks\Events\StateTypesRequested;
use App\Hooks\States\ReadyState;
use App\Hooks\States\Support\ReadyStateLoader;
use App\Hooks\States\Support\StateTypeRegistry;
use App\Hooks\Ticks\TickingTypes;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Builds the state type registry on first use, once per worker, and keeps it; a build that fails is tried again next time.
 */
final class StateTypes implements ResolvesStateTypes
{
    private StateTypeRegistry|null $registry = null;

    public function __construct(private readonly Dispatcher $events,
        private ReadyStateLoader $readyStates,
    ) {}

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
