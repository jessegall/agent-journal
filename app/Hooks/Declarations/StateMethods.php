<?php

declare(strict_types=1);

namespace App\Hooks\Declarations;

use App\Contracts\Event;
use App\Hooks\Attributes\StackWide;
use App\Hooks\Contracts\HookAnswerer;
use App\Hooks\Contracts\StateLoader;
use App\Hooks\Contracts\TickableState;
use App\Hooks\Events\StateTypesRequested;
use App\Hooks\Exceptions\InvalidStateClass;
use App\Hooks\Exceptions\InvalidStateMethod;
use App\Hooks\States\AgentState;
use App\Hooks\Values\EventCommands;
use ReflectionClass;
use ReflectionMethod;
use ReflectionNamedType;

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
    public function eventFor(ReflectionMethod $method): string|null
    {
        $name = $method->getName();
        $parameterClass = $this->argumentClass($method);
        $returnType = $method->getReturnType();
        $returnsCommands = $returnType instanceof ReflectionNamedType
            && $returnType->getName() === EventCommands::class;
        $takesEvent = $parameterClass !== null && is_a($parameterClass, Event::class, true);

        if (method_exists(AgentState::class, $name) || method_exists(TickableState::class, $name)) {
            if ($takesEvent || $returnsCommands) {
                throw InvalidStateMethod::for($method, 'uses a reserved state method name for an event listener.');
            }

            $this->assertUnmarked($method);

            return null;
        }

        if (! $this->hasEventMethodName($name) && ! $takesEvent && ! $returnsCommands) {
            $this->assertUnmarked($method);

            return null;
        }

        if ($parameterClass === null
            || ! is_subclass_of($parameterClass, Event::class)
            || ! $this->hasRequiredArgument($method)
            || ! $this->isPublicInstanceMethod($method)) {
            throw InvalidStateMethod::for($method, 'must be a public instance method with one required concrete Event.');
        }

        $event = new ReflectionClass($parameterClass);

        if ($event->isAbstract()
            || $event->isInterface()
            || $event->isEnum()
            || $parameterClass === StateTypesRequested::class) {
            throw InvalidStateMethod::for($method, 'must receive a concrete application event available to live states.');
        }

        $expected = 'on'.$event->getShortName();

        if ($name !== $expected) {
            throw InvalidStateMethod::for($method, "must be named {$expected}.");
        }

        if (! $returnsCommands || $returnType->allowsNull()) {
            throw InvalidStateMethod::for($method, 'must return '.EventCommands::class.'.');
        }

        $this->checkMarker($method);

        return $event->getName();
    }

    /**
     * @return array{methods: array<string, StateMethod>, events: array<class-string<Event>, StateMethod>}
     */
    private function declarationsFor(string $class): array
    {
        if (! is_subclass_of($class, AgentState::class)) {
            throw InvalidStateClass::for($class);
        }

        return $this->byClass[$class] ??= $this->discover(new ReflectionClass($class));
    }

    /**
     * @param  ReflectionClass<AgentState>  $state
     * @return array{methods: array<string, StateMethod>, events: array<class-string<Event>, StateMethod>}
     */
    private function discover(ReflectionClass $state): array
    {
        if ($state->isAbstract()) {
            throw InvalidStateClass::for($state->getName());
        }

        $this->checkClassMarkers($state);
        $hooks = new ReflectionClass(HookAnswerer::class);
        $methods = [];
        $events = [];

        foreach ($state->getMethods() as $method) {
            $name = $method->getName();

            if ($hooks->hasMethod($name)) {
                if ($this->isHookOverride($method, $hooks->getMethod($name))) {
                    $methods[$name] = StateMethod::fromMethod($state->getName(), $method);
                }

                continue;
            }

            $event = $this->eventFor($method);

            if ($event !== null) {
                $events[$event] = StateMethod::fromMethod($state->getName(), $method);
            }
        }

        return ['methods' => [...$methods, ...$events], 'events' => $events];
    }

    private function isHookOverride(ReflectionMethod $method, ReflectionMethod $hook): bool
    {
        if ($method->getDeclaringClass()->getName() === AgentState::class) {
            $this->assertUnmarked($method);

            return false;
        }

        if ($method->getName() !== $hook->getName()
            || ! $this->isPublicInstanceMethod($method)
            || ! $this->hasRequiredArgument($method)
            || $this->argumentClass($method) !== $this->argumentClass($hook)
            || (string) $method->getReturnType() !== (string) $hook->getReturnType()) {
            throw InvalidStateMethod::for($method, 'must match the signature on '.HookAnswerer::class.'.');
        }

        $this->checkMarker($method);

        return true;
    }

    private function hasEventMethodName(string $name): bool
    {
        return str_starts_with($name, 'on') && ctype_upper(substr($name, 2, 1));
    }

    private function hasRequiredArgument(ReflectionMethod $method): bool
    {
        $parameters = $method->getParameters();

        if (count($parameters) !== 1) {
            return false;
        }

        $parameter = $parameters[0];

        return ! $parameter->allowsNull()
            && ! $parameter->isOptional()
            && ! $parameter->isVariadic()
            && ! $parameter->isPassedByReference();
    }

    private function argumentClass(ReflectionMethod $method): string|null
    {
        $parameter = $method->getParameters()[0] ?? null;
        $type = $parameter?->getType();

        return $type instanceof ReflectionNamedType && ! $type->isBuiltin() ? $type->getName() : null;
    }

    private function isPublicInstanceMethod(ReflectionMethod $method): bool
    {
        return $method->isPublic() && ! $method->isStatic() && ! $method->isAbstract();
    }

    private function assertUnmarked(ReflectionMethod $method): void
    {
        if ($method->getAttributes(StackWide::class) !== []) {
            throw InvalidStateMethod::for($method, 'may use StackWide only on a hook override or state event method.');
        }
    }

    private function checkMarker(ReflectionMethod $method): void
    {
        $markers = $method->getAttributes(StackWide::class);

        if (count($markers) > 1 || array_any($markers, fn ($marker) => $marker->getArguments() !== [])) {
            throw InvalidStateMethod::for($method, 'may use StackWide once and with no arguments.');
        }
    }

    /**
     * @param  ReflectionClass<covariant object>  $class
     */
    private function checkClassMarkers(ReflectionClass $class): void
    {
        if ($class->getAttributes(StackWide::class) !== []) {
            throw InvalidStateMethod::on($class->getName(), 'class', 'may use StackWide only on a state method.');
        }

        foreach ($class->getProperties() as $property) {
            if ($property->getAttributes(StackWide::class) !== []) {
                throw InvalidStateMethod::on(
                    $class->getName(),
                    $property->getName(),
                    'may use StackWide only on a state method.',
                );
            }
        }

        foreach ($class->getTraits() as $trait) {
            $this->checkClassMarkers($trait);
        }

        $parent = $class->getParentClass();

        if ($parent !== false) {
            $this->checkClassMarkers($parent);
        }
    }
}
