<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

/**
 * One place that sends an event: its file and line, the class and method it stands in, the call and the event.
 */
final readonly class EventProducer
{
    public function __construct(
        public string $path,
        public int $line,
        public string $site,
        public string $call,
        public string $event,
    ) {}

    /**
     * Whether it is a model method raising the event on itself, such as $this->raise(new TaskFinished($id)).
     */
    public function isRaise(): bool
    {
        return $this->call === '->raise()';
    }

    public function line(): string
    {
        $event = ModelWriteScan::shortName($this->event);

        return "{$this->path}:{$this->line} {$this->site} sends {$event} through {$this->call}";
    }
}
