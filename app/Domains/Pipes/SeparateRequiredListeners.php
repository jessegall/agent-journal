<?php

declare(strict_types=1);

namespace App\Domains\Pipes;

use App\Contracts\Attributes\InCommandTransaction;
use App\Contracts\Attributes\RequiresListener;
use App\Domains\Exceptions\InvalidListener;
use App\Domains\Support\ListenerDeclarations;
use App\Pipelines\Contracts\Pipe;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;
use Illuminate\Contracts\Queue\ShouldQueue;
use ReflectionClass;

/**
 * Takes the listeners marked InCommandTransaction out of the dispatcher's map into the required map, each event's in
 * the order of their full names, and refuses a required listener that defers its work, is registered twice, or
 * belongs to a domain other than the event's owner without the owner's RequiresListener declaration.
 */
final readonly class SeparateRequiredListeners implements Pipe
{
    /**
     * The interfaces that move a listener's work out of the transaction.
     */
    private const array DEFERRING = [
        ShouldQueue::class,
        ShouldBroadcast::class,
        ShouldDispatchAfterCommit::class,
        ShouldHandleEventsAfterCommit::class,
    ];

    public function handle(ListenerDeclarations $declarations): ListenerDeclarations
    {
        $ordinary = [];
        $required = [];

        foreach ($declarations->events as $event => $listeners) {
            foreach ($listeners as $listener) {
                $requiredClass = self::requiredClassOf($listener);

                if ($requiredClass === null) {
                    $ordinary[$event][] = $listener;

                    continue;
                }

                $this->assertRequired($declarations, $event, $listener, $requiredClass, $required[$event] ?? []);
                $required[$event][] = $listener;
            }
        }

        return new ListenerDeclarations($ordinary, $declarations->ownership, array_map(self::sorted(...), $required));
    }

    /**
     * The listener's class when it carries InCommandTransaction, or none.
     *
     * @return ReflectionClass<object>|null
     */
    private static function requiredClassOf(string $listener): ReflectionClass|null
    {
        $class = explode('@', $listener, 2)[0];

        if (! class_exists($class)) {
            return null;
        }

        $reflection = new ReflectionClass($class);

        return $reflection->getAttributes(InCommandTransaction::class) === [] ? null : $reflection;
    }

    /**
     * @param  ReflectionClass<object>  $class
     * @param  list<string>  $earlier  the event's required listeners already taken
     *
     * @throws InvalidListener
     */
    private function assertRequired(
        ListenerDeclarations $declarations,
        string $event,
        string $listener,
        ReflectionClass $class,
        array $earlier,
    ): void {
        foreach (self::DEFERRING as $interface) {
            if ($class->implementsInterface($interface)) {
                throw InvalidListener::requiredButDeferred($listener, $event, $interface);
            }
        }

        if (in_array($listener, $earlier, true)) {
            throw InvalidListener::requiredTwice($listener, $event);
        }

        $owner = $declarations->ownership->domainHoldingListener((string) $class->getFileName());
        $eventOwner = $declarations->ownership->eventDomain($event, $listener);

        $isForeignUndeclared = $owner !== null
            && $owner !== $eventOwner
            && ! self::isDeclaredBy($event, $class->getName());

        if ($isForeignUndeclared) {
            throw InvalidListener::requiredWithoutDeclaration($listener, $event, $owner->name);
        }
    }

    private static function isDeclaredBy(string $event, string $listener): bool
    {
        if (! class_exists($event)) {
            return false;
        }

        foreach (new ReflectionClass($event)->getAttributes(RequiresListener::class) as $declaration) {
            if ($declaration->newInstance()->listener === $listener) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param  list<string>  $listeners
     * @return list<string>
     */
    private static function sorted(array $listeners): array
    {
        sort($listeners);

        return $listeners;
    }
}
