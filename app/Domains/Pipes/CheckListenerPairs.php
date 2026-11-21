<?php

declare(strict_types=1);

namespace App\Domains\Pipes;

use App\Contracts\Event;
use App\Domains\Exceptions\InvalidListener;
use App\Domains\Support\ListenerDeclarations;
use App\Domains\Support\ListenerOwnership;
use App\Hooks\States\AgentState;
use App\Pipelines\Contracts\Pipe;
use App\Reflection\Enums\TypeShape;
use App\Reflection\Support\DeclaredType;
use App\Reflection\Support\ReflectedMethod;
use App\Reflection\Support\Reflector;

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

        if (Reflector::exists($class) && Reflector::of($class)->isSubclassOf(AgentState::class)) {
            throw InvalidListener::stateRegisteredByHand($listener, $event);
        }

        if (! Reflector::exists($class)
            || ! Reflector::of($class)->isClass()
            || ! Reflector::of($class)->hasMethod($method)
            || ! $this->firstParameterAccepts(Reflector::of($class)->method($method), $event)) {
            throw InvalidListener::staleCache($listener, $event);
        }

        if (! Reflector::exists($event)
            || ! Reflector::of($event)->isSubclassOf(Event::class)
            || Reflector::of($event)->isAbstract()) {
            throw InvalidListener::notAConcreteEvent($listener, $event);
        }

        $listenerDomain = $ownership->listenerDomain($class, $listener, $event);
        $ownership->assertOwnership($event, $listener, $method, $listenerDomain);
    }

    private function firstParameterAccepts(ReflectedMethod $method, string $event): bool
    {
        $parameters = $method->parameters();

        if ($parameters === [] || $parameters[0]->type()->isEmpty()) {
            return false;
        }

        $type = $parameters[0]->type()->get();
        $arms = $type->shape === TypeShape::Union ? $type->members : [$type];

        return array_any(
            $arms,
            fn (DeclaredType $arm) => $arm->isNamed() && Reflector::of($event)->is($arm->name()),
        );
    }
}
