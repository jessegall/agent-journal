<?php

declare(strict_types=1);

namespace App\Domains\Support;

use App\Bus\Contracts\Command;
use App\Contracts\Event;
use App\Domains\Exceptions\InvalidExports;
use App\Exports\Support\Exports as DeclaredExports;
use App\Reflection\Support\Reflector;
use Illuminate\Database\Eloquent\Model;
use Throwable;

/**
 * Checks an owner's exports when the application starts: every name exists, sits in the owner's namespace and
 * belongs in the list it is in. It reads each class by reflection and constructs nothing; whether each public
 * signature leaks a private type is the architecture suite's question.
 */
final class Exports
{
    /**
     * The only names Core may export as support: traits, a base state, the base command and adapters that no other
     * list describes. Adding one is an architecture decision, never a fallback for a type that fits no list.
     */
    private const array CORE_SUPPORT = [
        'App\Actors\Models\Support\BelongsToOneActor',
        'App\Comments\Support\HasComments',
        'App\Hooks\States\AgentState',
        'App\Links\Support\Linkable',
        'App\Hooks\Decisions\StateReferenceFactory',
        'App\Assignments\Models\Support\AssignableListing',
        'App\Http\Requests\Web\Concerns\ReadsRouteNumber',
        'App\Links\Support\LinkAccess',
        'App\Links\Support\LinkTypeRegistry',
        'App\Records\Support\ProvidesModelRecords',
        'App\Queries\Support\TextSearch',
        'App\Numbers\Support\HasNumber',
        'App\Contracts\Support\RaisesEvents',
        'App\Contracts\Support\InsertsAbsentRows',
        'App\Reads\Support\CountsLoads',
        'App\Reads\Support\CountsPivotLoads',
        'App\Reads\Support\BoundedReads',
        'App\Reads\Support\ReadBuilder',
        'App\Mcp\Tools\JournalTool',
        'App\Mcp\Tools\JournalReadTool',
        'App\Mcp\Tools\JournalWriteTool',
        'App\Mcp\Resources\JournalResource',
        'App\Mcp\Tools\Concerns\ReadsAssignmentArguments',
        'App\Bus\Exceptions\Concerns\RendersRefusal',
        'App\AgentRequests\Console\Concerns\RunsCallPipelines',
        'App\Assignments\Calls\Concerns\NamesRecipient',
        'App\Assignments\Calls\Concerns\NamesExpectedAssignment',
        'App\Bus\Support\Command',
        'App\Reflection\Support\Reflector',
    ];

    /**
     * The same declaration with every name in its canonical spelling.
     *
     * @throws InvalidExports
     */
    public static function check(string $owner, string $namespace, DeclaredExports $exports): DeclaredExports
    {
        $check = new self($owner, $namespace);

        return DeclaredExports::make()
            ->events(...array_map(fn (string $name) => $check->event($name), $exports->events))
            ->contracts(...array_map(fn (string $name) => $check->contract($name), $exports->contracts))
            ->values(...array_map(fn (string $name) => $check->value($name), $exports->valueClasses))
            ->commands(...array_map(fn (string $name) => $check->command($name), $exports->commands))
            ->exceptions(...array_map(fn (string $name) => $check->exception($name), $exports->exceptions))
            ->support(...array_map(fn (string $name) => $check->support($name), $exports->support))
            ->build();
    }

    private function __construct(private string $owner, private string $namespace) {}

    /**
     * @return class-string<Event>
     */
    private function event(string $name): string
    {
        $type = $this->ownType('events', $name);
        $className = $type->name();

        $isConcreteEvent = ! $type->isInterface() && ! $type->isAbstract() && $type->isFinal();

        if (! $isConcreteEvent || ! $type->is(Event::class)) {
            throw InvalidExports::notAnEvent($this->owner, $className);
        }

        if ($type->is(Command::class)) {
            throw InvalidExports::eventIsACommand($this->owner, $className);
        }

        return $type->name();
    }

    /**
     * @return class-string
     */
    private function contract(string $name): string
    {
        $type = $this->ownType('contracts', $name);

        if (! $type->isInterface()) {
            throw InvalidExports::notAnInterface($this->owner, $type->name());
        }

        return $type->name();
    }

    /**
     * @return class-string
     */
    private function command(string $name): string
    {
        $type = $this->ownType('commands', $name);
        $isConcreteCommand = ! $type->isInterface() && ! $type->isAbstract() && $type->isFinal()
            && $type->is(Command::class);

        if (! $isConcreteCommand || $type->is(Event::class)) {
            throw InvalidExports::notACommand($this->owner, $type->name());
        }

        return $type->name();
    }

    /**
     * @return class-string<Throwable>
     */
    private function exception(string $name): string
    {
        $type = $this->ownType('exceptions', $name);
        $className = $type->name();

        if (! $type->is(Throwable::class) || ! str_contains($className, '\\Exceptions\\')) {
            throw InvalidExports::notAnException($this->owner, $className);
        }

        return $type->name();
    }

    /**
     * @return class-string
     */
    private function value(string $name): string
    {
        $type = $this->ownType('values', $name);
        $reason = $this->reasonNotAValue($type);

        if ($reason !== null) {
            throw InvalidExports::notAValue($this->owner, $type->name(), $reason);
        }

        return $type->name();
    }

    /**
     * @param  Reflector<object>  $type
     */
    private function reasonNotAValue(Reflector $type): string|null
    {
        return match (true) {
            $type->isEnum() => null,
            $type->isInterface() => 'it is an interface; export it under contracts',
            $type->isTrait() => 'it is a trait, which only Core may export, under support',
            $type->is(Event::class) => 'it is an event; export it under events',
            $type->is(Command::class) => 'it is a command; export it under commands',
            $type->is(Throwable::class) => 'it is an exception; export it under exceptions',
            $type->isSubclassOf(Model::class) => 'it is a model, which stays private to its owner',
            ! $type->isFinal() => 'it is not final; a public value is a final class or an enum',
            default => null,
        };
    }

    /**
     * @return class-string
     */
    private function support(string $name): string
    {
        $type = $this->ownType('support', $name);

        if ($this->owner !== 'Core') {
            throw InvalidExports::supportOutsideCore($this->owner, $type->name());
        }

        if (! in_array($type->name(), self::CORE_SUPPORT, true)) {
            throw InvalidExports::unknownSupport($type->name());
        }

        return $type->name();
    }

    /**
     * The exported type as PHP knows it, after it is found and seen to sit in the owner's namespace.
     *
     * @return Reflector<object>
     */
    private function ownType(string $group, string $name): Reflector
    {
        $className = ltrim($name, '\\');

        if (! Reflector::exists($className)) {
            throw InvalidExports::missing($this->owner, $group, $className);
        }

        if (stripos($className, $this->namespace.'\\') !== 0) {
            throw InvalidExports::outsideOwner($this->owner, $className, $this->namespace);
        }

        return Reflector::of($className);
    }
}
