<?php

declare(strict_types=1);

namespace App\Hooks\Declarations;

use App\Contracts\Event;
use App\Hooks\Contracts\HookAnswerer;
use App\Hooks\Contracts\StateLoader;
use App\Hooks\States\AgentState;
use ReflectionClass;
use ReflectionMethod;
use ReflectionNamedType;

/**
 * Finds effective hook and event methods and caches their declarations by state class.
 */
final class StateMethods
{
    /**
     * @var array<class-string<AgentState>, array<string, StateMethod>>
     */
    private array $byClass = [];

    /**
     * @return array<string, StateMethod>
     */
    public function forLoader(StateLoader $loader): array
    {
        return $this->forState($loader->stateClass());
    }

    /**
     * @param class-string<AgentState> $stateClass
     * @return array<string, StateMethod>
     */
    public function forState(string $stateClass): array
    {
        return $this->byClass[$stateClass] ??= $this->discover(new ReflectionClass($stateClass));
    }

    /**
     * @param ReflectionClass<AgentState> $state
     * @return array<string, StateMethod>
     */
    private function discover(ReflectionClass $state): array
    {
        $hooks = new ReflectionClass(HookAnswerer::class);
        $methods = [];

        foreach ($state->getMethods() as $method) {
            if ($method->getDeclaringClass()->getName() === AgentState::class) {
                continue;
            }

            if ($hooks->hasMethod($method->getName())) {
                $methods[$method->getName()] = StateMethod::fromMethod($state->getName(), $method);

                continue;
            }

            $event = $this->eventClass($method);

            if ($event === null) {
                continue;
            }

            $methods[$event] = StateMethod::fromMethod($state->getName(), $method);
        }

        return $methods;
    }

    /**
     * @return class-string<Event>|null
     */
    private function eventClass(ReflectionMethod $method): ?string
    {
        $parameters = $method->getParameters();

        if (count($parameters) !== 1) {
            return null;
        }

        $type = $parameters[0]->getType();

        if (! $type instanceof ReflectionNamedType || ! is_subclass_of($type->getName(), Event::class)) {
            return null;
        }

        $event = new ReflectionClass($type->getName());

        if ($method->getName() !== 'on'.$event->getShortName()) {
            return null;
        }

        return $event->getName();
    }
}
