<?php

declare(strict_types=1);

namespace App\Domains\Pipes;

use App\Contracts\Event;
use App\Domains\Exceptions\InvalidListener;
use App\Domains\Support\ListenerDeclarations;
use App\Domains\Support\ListenerOwnership;
use App\Hooks\States\AgentState;
use App\Pipelines\Contracts\Pipe;
use ReflectionClass;
use ReflectionMethod;
use ReflectionNamedType;
use ReflectionUnionType;

/**
 * Checks each listener declaration against its callable, concrete event and owner.
 */
final readonly class CheckListenerPairs implements Pipe
{
    public function handle(ListenerDeclarations $declarations): ListenerDeclarations
    {
        foreach ($declarations->events as $event => $listeners) {
            foreach ($listeners as $listener) {
                $this->assertPair($declarations->ownership, $event, $listener);
            }
        }

        return $declarations;
    }

    private function assertPair(ListenerOwnership $ownership, string $event, string $listener): void
    {
        [$class, $method] = array_pad(explode('@', $listener, 2), 2, 'handle');

        if (is_subclass_of($class, AgentState::class)) {
            throw InvalidListener::stateRegisteredByHand($listener, $event);
        }

        if (! class_exists($class)
            || ! method_exists($class, $method)
            || ! $this->firstParameterAccepts(new ReflectionMethod($class, $method), $event)) {
            throw InvalidListener::staleCache($listener, $event);
        }

        if (! class_exists($event)
            || ! is_subclass_of($event, Event::class)
            || new ReflectionClass($event)->isAbstract()) {
            throw InvalidListener::notAConcreteEvent($listener, $event);
        }

        $listenerDomain = $ownership->listenerDomain($class, $listener, $event);
        $ownership->assertOwnership($event, $listener, $method, $listenerDomain);
    }

    private function firstParameterAccepts(ReflectionMethod $method, string $event): bool
    {
        $type = ($method->getParameters()[0] ?? null)?->getType();
        $arms = $type instanceof ReflectionUnionType ? $type->getTypes() : [$type];

        return array_any(
            $arms,
            fn (mixed $arm) => $arm instanceof ReflectionNamedType && is_a($event, $arm->getName(), true),
        );
    }
}
