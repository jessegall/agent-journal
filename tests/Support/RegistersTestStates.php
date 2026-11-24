<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Events\StateTypesRequested;
use App\Support\StateLoading\RegisteredStateType;
use App\Support\States\AgentState;
use Closure;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Registers a test's own state types before the registry is built, and lets a test hand out a scripted state: the
 * builder makes a state through the container, so a binding of its class answers.
 */
trait RegistersTestStates
{
    /**
     * @param  class-string<AgentState>  $stateClass
     */
    private function registerTestState(string $key, string $stateClass, int $schemaVersion = 1): void
    {
        $this->app->make(Dispatcher::class)->listen(
            StateTypesRequested::class,
            fn (StateTypesRequested $event) => $event->registry->register(
                RegisteredStateType::named($key, $stateClass, $schemaVersion),
            ),
        );
    }

    /**
     * @param  class-string<AgentState>  $stateClass
     * @param  Closure(): AgentState  $make
     */
    private function makeStatesWith(string $stateClass, Closure $make): void
    {
        $this->app->bind($stateClass, $make);
    }
}
