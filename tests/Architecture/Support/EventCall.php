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
        return $this->takesOnlyEvents && $this->argument->isWrittenName();
    }

    /**
     * A listener passing the event it received to a raise, such as event($event) in handle(TaskClosed $event).
     */
    public function raisesReceivedEvent(): bool
    {
        return $this->raises && $this->argument === EventArgument::ListenerParameter;
    }

    /**
     * A raise of an event of that domain named by its class, such as Event::dispatch(TaskClosed::class).
     */
    /**
     * Whether this call raises, by its class, an event whose name matches the pattern.
     */
    public function raisesClassEventIn(string $namePattern): bool
    {
        return $this->raises && $this->argument === EventArgument::ClassName && preg_match($namePattern, ltrim($this->event, '\\')) === 1;
    }

    public function raisesClassEventOf(DomainEntry $owner): bool
    {
        return $this->raises && $this->argument === EventArgument::ClassName && $owner->ownsEvent($this->event);
    }
}
