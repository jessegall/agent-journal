<?php

declare(strict_types=1);

namespace App\Support\Stack;

use App\Contracts\Work\WorkOccurrenceGuard;
use App\Events\Hooks\StateTypesRequested;
use App\Support\StateCatalog\Contracts\StateTypes as StateTypesContract;
use App\Support\StateCatalog\StateTypeRegistry;
use App\Support\StateLoading\RegisteredStateType;
use App\Support\States\AnsweringAskState;
use App\Support\States\AnsweringMessageState;
use App\Support\States\AwaitingSkillsState;
use App\Support\States\ReadyState;
use App\Support\Ticks\TickingTypes;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Builds the state type registry on first use, once per worker, and keeps it; a build that fails is tried again next
 * time.
 */
final class StateTypes implements StateTypesContract
{
    /**
     * Core's own states; every domain registers its own when the registry is built.
     */
    private const array CORE_STATES = [
        ReadyState::class,
        AnsweringAskState::class,
        AnsweringMessageState::class,
        AwaitingSkillsState::class,
    ];

    private StateTypeRegistry|null $registry = null;

    public function __construct(
        private readonly Dispatcher $events,
        private readonly Container $container,
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
        return $this->container->make($this->registry()->get($typeKey)->tickGuard());
    }

    public function ticking(): TickingTypes
    {
        return new TickingTypes($this->registry()->tickingTypeKeys());
    }

    private function build(): StateTypeRegistry
    {
        $registry = new StateTypeRegistry();

        foreach (self::CORE_STATES as $stateClass) {
            $registry->register(RegisteredStateType::of($stateClass));
        }

        $this->events->dispatch(new StateTypesRequested($registry));
        $registry->freeze();

        return $registry;
    }
}
