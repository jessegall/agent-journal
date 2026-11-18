<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Domains\Support\DomainEntry;

/**
 * One call that raises or hears an event: the call as written, what it passes, and whether a string there is surely an event.
 */
final readonly class EventCall
{
    /**
     * @param  string  $event  the written name, the resolved class, or the code passed as the event
     */
    public function __construct(
        public string $file,
        public int $line,
        public string $call,
        public bool $raises,
        public bool $takesOnlyEvents,
        public EventArgument $argument,
        public string $event,
    ) {}

    /**
     * A string named as the event where only an event can stand: listen, the event() helper or the Event facade.
     */
    public function isEventNamedByString(): bool
    {
        return $this->takesOnlyEvents && $this->argument->isWrittenName() && ! $this->namesModelLifecycle();
    }

    /**
     * One of Laravel's model lifecycle strings, such as 'eloquent.retrieved: *': a framework hook, not an event of
     * the project.
     */
    private function namesModelLifecycle(): bool
    {
        return str_starts_with($this->event, 'eloquent.');
    }

    /**
     * A listener registered by hand instead of through a typed listener in a Listeners folder: an event class of the
     * project, a wildcard, a subscriber or a provider property. Framework lifecycle strings such as 'eloquent.booted: X'
     * and framework events are not the project's, so they pass.
     */
    public function registersListenerByHand(ProjectRoots $roots): bool
    {
        if ($this->raises) {
            return false;
        }

        return match ($this->argument) {
            EventArgument::ClassName => $roots->startsWithProjectNamespace($this->event),
            EventArgument::String => str_contains($this->event, '*') && ! $this->namesModelLifecycle(),
            EventArgument::Other => in_array($this->call, ['subscribe(Dispatcher)', '$listen', '$subscribe'], true) || str_ends_with($this->call, 'subscribe()'),
            default => false,
        };
    }

    /**
     * A listener passing the event it received to a raise, such as event($event) in handle(TaskClosed $event).
     */
    public function raisesReceivedEvent(): bool
    {
        return $this->raises && $this->argument === EventArgument::ListenerParameter;
    }

    /**
     * Whether this call raises an event named by its class, such as Event::dispatch(TaskClosed::class).
     */
    public function raisesClassEvent(): bool
    {
        return $this->raises && $this->argument === EventArgument::ClassName;
    }

    /**
     * A raise of an event of that domain named by its class.
     */
    public function raisesClassEventOf(DomainEntry $owner): bool
    {
        return $this->raises && $this->argument === EventArgument::ClassName && $owner->ownsEvent($this->event);
    }
}
