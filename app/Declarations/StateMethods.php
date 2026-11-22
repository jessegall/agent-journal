<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Contracts\Event;
use App\Contracts\TickableState;
use App\Events\StateTypesRequested;
use App\Exceptions\InvalidStateMethod;
use App\Support\DeclaredType;
use App\Support\Inputs\Contracts\HookAnswerer;
use App\Support\ReflectedMethod;
use App\Support\Reflector;
use App\Support\StateLoading\Contracts\StateLoader;
use App\Support\States\AgentState;
use App\Support\States\Exceptions\InvalidStateClass;

/**
 * Checks and caches effective hook and event declarations by state class.
 */
final class StateMethods
{
    /**
     * @var array<class-string<AgentState>, array{
     *     methods: array<string, StateMethod>, events: array<class-string<Event>, StateMethod>
     * }>
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
     * @return array<class-string<Event>, StateMethod>
     */
    public function eventsForLoader(StateLoader $loader): array
    {
        return $this->declarationsFor($loader->stateClass())['events'];
    }

    /**
     * @return array<string, StateMethod>
     */
    public function forState(string $class): array
    {
        return $this->declarationsFor($class)['methods'];
    }

    /**
     * @return class-string<Event>|null
     */
    public function eventFor(ReflectedMethod $method): string|null
    {
        $name = $method->name();
        $parameterClass = $this->argumentClass($method);

        $takesEvent = $parameterClass !== null
            && Reflector::factory()->is($parameterClass, Event::class);

        if (Reflector::of(AgentState::class)->hasMethod($name)
            || Reflector::of(TickableState::class)->hasMethod($name)) {
            if ($takesEvent) {
                throw InvalidStateMethod::for($method, 'uses a reserved state method name for an event listener.');
            }

            return null;
        }

        if (! $this->hasEventMethodName($name) && ! $takesEvent) {
            return null;
        }

        if ($parameterClass === null
            || ! $takesEvent
            || $parameterClass === Event::class
            || ! $this->hasRequiredArgument($method)
            || ! $this->isPublicInstanceMethod($method)) {
            throw InvalidStateMethod::for($method, 'must be a public instance method with one required concrete Event.');
        }

        $event = Reflector::of($parameterClass);

        if ($event->isAbstract()
            || $event->isInterface()
            || $event->isEnum()
            || $parameterClass === StateTypesRequested::class) {
            throw InvalidStateMethod::for($method, 'must receive a concrete application event available to live states.');
        }

        $expected = 'on'.$event->shortName();

        if ($name !== $expected) {
            throw InvalidStateMethod::for($method, "must be named {$expected}.");
        }

        return $event->name();
    }

    /**
     * @return array{methods: array<string, StateMethod>, events: array<class-string<Event>, StateMethod>}
     */
    private function declarationsFor(string $class): array
    {
        if (! Reflector::factory()->isSubclassOf($class, AgentState::class)) {
            throw InvalidStateClass::for($class);
        }

        return $this->byClass[$class] ??= $this->discover(Reflector::of($class));
    }

    /**
     * @param  Reflector<AgentState>  $state
     * @return array{methods: array<string, StateMethod>, events: array<class-string<Event>, StateMethod>}
     */
    private function discover(Reflector $state): array
    {
        if ($state->isAbstract()) {
            throw InvalidStateClass::for($state->name());
        }

        $hooks = Reflector::of(HookAnswerer::class);
        $methods = [];
        $events = [];

        foreach ($state->methods() as $method) {
            $name = $method->name();
            $declared = StateMethod::fromMethod($state->name(), $method);

            if ($hooks->hasMethod($name)) {
                if ($this->isHookOverride($method, $hooks->method($name))) {
                    $methods[$name] = $declared;
                }

                continue;
            }

            $event = $this->eventFor($method);

            if ($event !== null) {
                $events[$event] = $declared;
            }
        }

        return ['methods' => [...$methods, ...$events], 'events' => $events];
    }

    private function isHookOverride(ReflectedMethod $method, ReflectedMethod $hook): bool
    {
        if ($method->declaringClass()->name() === AgentState::class) {
            return false;
        }

        if ($method->name() !== $hook->name()
            || ! $this->isPublicInstanceMethod($method)
            || ! $this->hasRequiredArgument($method)
            || $this->argumentClass($method) !== $this->argumentClass($hook)) {
            throw InvalidStateMethod::for($method, 'must match the signature on '.HookAnswerer::class.'.');
        }

        return true;
    }

    private function hasEventMethodName(string $name): bool
    {
        return str_starts_with($name, 'on') && ctype_upper(substr($name, 2, 1));
    }

    private function hasRequiredArgument(ReflectedMethod $method): bool
    {
        $parameters = $method->parameters();

        if (count($parameters) !== 1) {
            return false;
        }

        $parameter = $parameters[0];

        return ! $parameter->allowsNull()
            && ! $parameter->isOptional()
            && ! $parameter->isVariadic()
            && ! $parameter->isPassedByReference();
    }

    private function argumentClass(ReflectedMethod $method): string|null
    {
        $parameters = $method->parameters();

        if ($parameters === []) {
            return null;
        }

        return $parameters[0]->type()
            ->filter(fn (DeclaredType $type) => $type->isNamed() && ! $type->isBuiltin())
            ->map(fn (DeclaredType $type) => $type->name())
            ->getOrElse(null);
    }

    private function isPublicInstanceMethod(ReflectedMethod $method): bool
    {
        return $method->isPublic() && ! $method->isStatic() && ! $method->isAbstract();
    }
}
