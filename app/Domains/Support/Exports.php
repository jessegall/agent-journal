<?php

declare(strict_types=1);

namespace App\Domains\Support;

use App\Bus\Contracts\Command;
use App\Contracts\Event;
use App\Domains\Exceptions\InvalidExports;
use App\Exports\Support\Exports as DeclaredExports;
use Illuminate\Database\Eloquent\Model;
use ReflectionClass;
use Throwable;

/**
 * Checks an owner's exports when the application starts: every name exists, sits in the owner's namespace and
 * belongs in the list it is in. It reads each class by reflection and constructs nothing; whether each public
 * signature leaks a private type is the architecture suite's question.
 */
final class Exports
{
    /**
     * The only names Core may export as support: traits, a base state and adapters that no other list describes.
     * Adding one is an architecture decision, never a fallback for a type that fits no list.
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
        'App\Reads\Support\CountsLoads',
        'App\Reads\Support\CountsPivotLoads',
        'App\Reads\Support\BoundedReads',
        'App\Reads\Support\ReadBuilder',
        'App\Mcp\Tools\JournalTool',
        'App\Mcp\Tools\JournalReadTool',
        'App\Mcp\Resources\JournalResource',
        'App\Bus\Exceptions\Concerns\RendersRefusal',
        'App\AgentRequests\Console\Concerns\SendsSignedCalls',
        'App\AgentRequests\Console\Concerns\SendsSignedWrites',
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
            ->values(...array_map(fn (string $name) => $check->value($name), $exports->values))
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
        $className = $type->getName();

        if ($type->isInterface() || $type->isAbstract() || ! $type->isFinal() || ! is_a($className, Event::class, true)) {
            throw InvalidExports::notAnEvent($this->owner, $className);
        }

        if ($type->implementsInterface(Command::class)) {
            throw InvalidExports::eventIsACommand($this->owner, $className);
        }

        return $className;
    }

    /**
     * @return class-string
     */
    private function contract(string $name): string
    {
        $type = $this->ownType('contracts', $name);

        if (! $type->isInterface()) {
            throw InvalidExports::notAnInterface($this->owner, $type->getName());
        }

        return $type->getName();
    }

    /**
     * @return class-string
     */
    private function command(string $name): string
    {
        $type = $this->ownType('commands', $name);
        $isConcreteCommand = ! $type->isInterface() && ! $type->isAbstract() && $type->isFinal() && $type->implementsInterface(Command::class);

        if (! $isConcreteCommand || $type->implementsInterface(Event::class)) {
            throw InvalidExports::notACommand($this->owner, $type->getName());
        }

        return $type->getName();
    }

    /**
     * @return class-string<Throwable>
     */
    private function exception(string $name): string
    {
        $className = $this->ownType('exceptions', $name)->getName();

        if (! is_a($className, Throwable::class, true) || ! str_contains($className, '\\Exceptions\\')) {
            throw InvalidExports::notAnException($this->owner, $className);
        }

        return $className;
    }

    /**
     * @return class-string
     */
    private function value(string $name): string
    {
        $type = $this->ownType('values', $name);
        $reason = $this->reasonNotAValue($type);

        if ($reason !== null) {
            throw InvalidExports::notAValue($this->owner, $type->getName(), $reason);
        }

        return $type->getName();
    }

    /**
     * @param  ReflectionClass<object>  $type
     */
    private function reasonNotAValue(ReflectionClass $type): string|null
    {
        return match (true) {
            $type->isEnum() => null,
            $type->isInterface() => 'it is an interface; export it under contracts',
            $type->isTrait() => 'it is a trait, which only Core may export, under support',
            $type->implementsInterface(Event::class) => 'it is an event; export it under events',
            $type->implementsInterface(Command::class) => 'it is a command; export it under commands',
            $type->implementsInterface(Throwable::class) => 'it is an exception; export it under exceptions',
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
            throw InvalidExports::supportOutsideCore($this->owner, $type->getName());
        }

        if (! in_array($type->getName(), self::CORE_SUPPORT, true)) {
            throw InvalidExports::unknownSupport($type->getName());
        }

        return $type->getName();
    }

    /**
     * The exported type as PHP knows it, after it is found and seen to sit in the owner's namespace.
     *
     * @return ReflectionClass<object>
     */
    private function ownType(string $list, string $name): ReflectionClass
    {
        $className = ltrim($name, '\\');

        if (! class_exists($className) && ! interface_exists($className) && ! enum_exists($className) && ! trait_exists($className)) {
            throw InvalidExports::missing($this->owner, $list, $className);
        }

        if (stripos($className, $this->namespace.'\\') !== 0) {
            throw InvalidExports::outsideOwner($this->owner, $className, $this->namespace);
        }

        return new ReflectionClass($className);
    }
}
