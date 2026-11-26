<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Contracts\Bus\Command;
use App\Contracts\Events\Event;
use App\Contracts\Work\TickableState;
use App\Events\Hooks\StateTypesRequested;
use App\Exceptions\InvalidStateMethod;
use App\Support\Decisions\Contracts\AnswerPart;
use App\Support\DeclaredType;
use App\Support\Inputs\Contracts\HookAnswerer;
use App\Support\References\StateReference;
use App\Support\ReflectedMethod;
use App\Support\Reflector;
use App\Support\States\AgentState;
use App\Support\States\Exceptions\InvalidStateClass;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Checks and caches effective hook and event declarations by state class.
 */
final class StateMethods
{
    /**
     * The method every state asks before its listeners, which takes an Event but is no listener itself.
     */
    private const string LISTENS_TO = 'listensTo';

    /**
     * The types a hook method returns, and so the only ones an event method may return besides void.
     */
    private const array HOOK_ANSWER_TYPES = [
        AnswerPart::class,
        Command::class,
        Event::class,
        StateReference::class,
    ];

    /**
     * @var array<class-string<AgentState>, array{
     *     methods: array<string, StateMethod>, events: array<class-string<Event>, StateMethod>
     * }>
     */
    private array $byClass = [];

    /**
     * The event listeners the state class declares, by event.
     *
     * @param  class-string<AgentState>  $class
     * @return array<class-string<Event>, StateMethod>
     */
    public function eventsOf(string $class): array
    {
        return $this->declarationsFor($class)['events'];
    }

    /**
     * The state's method that listens to the event: the one typed on its class, or else the one typed on a group it
     * belongs to.
     *
     * @param  class-string<AgentState>  $class
     * @return Option<StateMethod>
     */
    public function methodFor(string $class, Event $event): Option
    {
        $events = $this->eventsOf($class);

        if (array_key_exists($event::class, $events)) {
            return new Some($events[$event::class]);
        }

        $eventTypes = Reflector::of($event)->typeNames();
        $group = array_find_key($events, fn (StateMethod $method, string $type) => in_array($type, $eventTypes, true));

        if ($group === null) {
            return None::create();
        }

        return new Some($events[$group]);
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
            if ($takesEvent && $name !== self::LISTENS_TO) {
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
            throw InvalidStateMethod::for($method, 'must be a public instance method with one required Event.');
        }

        $event = Reflector::of($parameterClass);

        if ($event->isEnum() || $parameterClass === StateTypesRequested::class) {
            throw InvalidStateMethod::for($method, 'must receive an application event available to live states.');
        }

        $expected = 'on'.$event->shortName();

        if ($name !== $expected) {
            throw InvalidStateMethod::for($method, "must be named {$expected}.");
        }

        if (! $this->answersAsHooksDo($method)) {
            throw InvalidStateMethod::for($method, 'must return void or what a hook returns: an AnswerPart, a Command, '
                .'an Event, a StateReference to push or an iterable of them, never null or an array.');
        }

        return $event->name();
    }

    /**
     * Whether the method declares void or never, or only the types a hook method returns: AnswerPart, Command, Event,
     * StateReference and iterable.
     */
    private function answersAsHooksDo(ReflectedMethod $method): bool
    {
        return $method->returnType()
            ->map(fn (DeclaredType $type) => $type->isNamedAs('void')
                || $type->isNamedAs('never')
                || $this->isHookAnswerType($type))
            ->getOrElse(false);
    }

    private function isHookAnswerType(DeclaredType $type): bool
    {
        if ($type->allowsNull) {
            return false;
        }

        if (! $type->isNamed()) {
            return array_all($type->members, fn (DeclaredType $member) => $this->isHookAnswerType($member));
        }

        $name = $type->name();

        if ($type->isBuiltin() || ! Reflector::exists($name)) {
            return $name === 'iterable';
        }

        $declared = Reflector::of($name);

        return array_any(
            self::HOOK_ANSWER_TYPES,
            fn (string $answer) => in_array($answer, $declared->typeNames(), true),
        );
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

        return [
            'methods' => [
                ...$methods,
                ...$events,
            ],
            'events' => $events,
        ];
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
        return $method->firstParameterClass()->getOrElse(null);
    }

    private function isPublicInstanceMethod(ReflectedMethod $method): bool
    {
        return $method->isPublic() && ! $method->isStatic() && ! $method->isAbstract();
    }
}
