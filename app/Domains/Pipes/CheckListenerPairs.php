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

        $listenerType = Reflector::find($class);

        if ($listenerType->filter(fn (Reflector $type) => $type->isSubclassOf(AgentState::class))->isDefined()) {
            throw InvalidListener::stateRegisteredByHand($listener, $event);
        }

        $handler = $listenerType->filter(fn (Reflector $type) => $type->isClass() && $type->hasMethod($method));

        if ($handler->isEmpty() || ! $this->firstParameterAccepts($handler->get()->method($method), $event)) {
            throw InvalidListener::staleCache($listener, $event);
        }

        $isConcreteEvent = Reflector::find($event)
            ->filter(fn (Reflector $type) => $type->isSubclassOf(Event::class) && $type->not()->isAbstract())
            ->isDefined();

        if (! $isConcreteEvent) {
            throw InvalidListener::notAConcreteEvent($listener, $event);
        }

        $listenerDomain = $ownership->listenerDomain($handler->get()->name(), $listener, $event);
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
            fn (DeclaredType $arm) => $arm->isNamed()
                && Reflector::exists($arm->name())
                && Reflector::factory()->is($event, $arm->name()),
        );
    }
}
