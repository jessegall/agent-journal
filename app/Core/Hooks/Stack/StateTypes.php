<?php

declare(strict_types=1);

namespace App\Core\Hooks\Stack;

use App\Core\Hooks\Events\StateTypesRequested;
use App\Core\Hooks\States\Support\ReadyStateType;
use App\Core\Hooks\States\Support\StateTypeRegistry;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Builds the state type registry on first use, once per worker, and keeps it; a build that fails is tried again next time.
 */
final class StateTypes
{
    private StateTypeRegistry|null $registry = null;

    public function __construct(private readonly Dispatcher $events) {}

    public function registry(): StateTypeRegistry
    {
        return $this->registry ??= $this->build();
    }

    private function build(): StateTypeRegistry
    {
        $registry = new StateTypeRegistry;

        foreach (ReadyStateType::cases() as $role) {
            $registry->register($role->value, $role);
        }

        $this->events->dispatch(new StateTypesRequested($registry));
        $registry->freeze();

        return $registry;
    }
}
