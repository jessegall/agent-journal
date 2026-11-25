<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Support\ReflectedType;
use Closure;
use Illuminate\Contracts\Events\Dispatcher;
use PHPUnit\Framework\Assert;

/**
 * What the journal fixture sees of the events a test's act sends: a window opened after the arrangement records each
 * event of the types named once, whether a listener heard it by its own type or its group's, and lets it go on to
 * every listener as it would.
 */
trait ObservesEvents
{
    /**
     * @var list<class-string>
     */
    private array $observedTypes = [];

    /**
     * @var array<int, object> the events seen in the window, by object, so one heard twice counts once
     */
    private array $observedEvents = [];

    /**
     * Opens a new window on the events of these types, or of the groups they name; what came before is forgotten.
     *
     * @param  class-string  ...$types
     */
    public function observeEvents(string ...$types): self
    {
        $this->observedEvents = [];
        $events = $this->app->make(Dispatcher::class);

        foreach (array_diff($types, $this->observedTypes) as $type) {
            $events->listen($type, function (object $event): void {
                $this->observedEvents[spl_object_id($event)] = $event;
            });
        }

        $this->observedTypes = array_values(array_unique([...$this->observedTypes, ...$types]));

        return $this;
    }

    /**
     * So many events of the type were seen in the window, of those the predicate accepts when one is given.
     *
     * @template TEvent of object
     *
     * @param  class-string<TEvent>  $type
     * @param  (Closure(TEvent): bool)|null  $predicate
     */
    public function assertEvent(string $type, Closure|null $predicate = null, int $count = 1): self
    {
        $eventType = ReflectedType::of($type);
        $seen = array_filter(
            $this->observedEvents,
            fn (object $event) => $eventType->isInstance($event) && ($predicate === null || $predicate($event)),
        );

        Assert::assertCount($count, $seen, "The window saw a different number of {$type} events.");

        return $this;
    }

    /**
     * @param  class-string  $type
     */
    public function assertEventCount(string $type, int $count): self
    {
        return $this->assertEvent($type, count: $count);
    }
}
