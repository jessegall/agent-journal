<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Contracts\Event;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;
use Psr\Log\LoggerInterface;
use Throwable;

/**
 * Releases the facts of committed event units once no command of the request still runs: each occurrence in its
 * order, once, through Laravel's dispatcher resolved at delivery, so wildcard, queued and broadcast listeners and a
 * test's fake see only committed facts. A failure is logged and delivery goes on with the next occurrence; it never
 * rolls back the committed producer.
 */
final class Publication
{
    /**
     * @var list<EventUnit>
     */
    private array $committed = [];

    public function __construct(
        private readonly CommandNesting $nesting,
        private readonly Container $container,
        private readonly LoggerInterface $log,
    ) {}

    /**
     * Takes a unit whose batch is ready, and releases it at once when no command runs.
     */
    public function committed(EventUnit $unit): void
    {
        $this->committed[] = $unit;

        if ($this->nesting->isEmpty()) {
            $this->release();
        }
    }

    /**
     * Releases every committed unit's facts, oldest unit first.
     */
    public function release(): void
    {
        while ($this->committed !== []) {
            $unit = array_shift($this->committed);

            foreach ($unit->batch() as $event) {
                $this->deliver($event);
            }
        }
    }

    private function deliver(Event $event): void
    {
        try {
            $this->container->make(Dispatcher::class)->dispatch($event);
        } catch (Throwable $failure) {
            $this->log->error('A listener of a committed fact failed.', [
                'event' => $event::class,
                'listener_failure' => $failure::class,
            ]);
        }
    }
}
