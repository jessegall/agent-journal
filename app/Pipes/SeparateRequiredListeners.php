<?php

declare(strict_types=1);

namespace App\Pipes;

use App\Attributes\InCommandTransaction;
use App\Attributes\RequiresListener;
use App\Contracts\Bus\Pipe;
use App\Exceptions\InvalidListener;
use App\Support\ListenerDeclarations;
use App\Support\Reflector;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;
use Illuminate\Contracts\Queue\ShouldQueue;

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
    private const array DEFERRING_INTERFACES = [
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
     * @return Reflector<object>|null
     */
    private static function requiredClassOf(string $listener): Reflector|null
    {
        $class = explode('@', $listener, 2)[0];

        return Reflector::find($class)
            ->filter(fn (Reflector $type) => $type->isClass() && $type->hasAttribute(InCommandTransaction::class))
            ->getOrElse(null);
    }

    /**
     * @param  Reflector<object>  $class
     * @param  list<string>  $earlier  the event's required listeners already taken
     *
     * @throws InvalidListener
     */
    private function assertRequired(
        ListenerDeclarations $declarations,
        string $event,
        string $listener,
        Reflector $class,
        array $earlier,
    ): void {
        foreach (self::DEFERRING_INTERFACES as $interface) {
            if ($class->implements($interface)) {
                throw InvalidListener::requiredButDeferred($listener, $event, $interface);
            }
        }

        if (in_array($listener, $earlier, true)) {
            throw InvalidListener::requiredTwice($listener, $event);
        }

        $owner = $declarations->ownership->domainHoldingListener($class->fileName()->getOrElse(''));
        $eventOwner = $declarations->ownership->eventDomain($event, $listener);

        $isForeignUndeclared = $owner !== null
            && $owner !== $eventOwner
            && ! self::isDeclaredBy($event, $class->name());

        if ($isForeignUndeclared) {
            throw InvalidListener::requiredWithoutDeclaration($listener, $event, $owner->name);
        }
    }

    private static function isDeclaredBy(string $event, string $listener): bool
    {
        $eventType = Reflector::find($event)->filter(fn (Reflector $type) => $type->isClass());

        if ($eventType->isEmpty()) {
            return false;
        }

        foreach ($eventType->get()->attributes(RequiresListener::class) as $declaration) {
            if ($declaration->listener === $listener) {
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
