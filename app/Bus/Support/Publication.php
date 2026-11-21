<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\Contracts\FactStaging;
use App\Contracts\Event;
use Psr\Log\LoggerInterface;
use Throwable;

/**
 * Releases the facts of committed event units once no command of the request still runs: each occurrence in its
 * order, once, through the fact staging and Laravel's dispatcher, so wildcard, queued and broadcast listeners and a
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
        private readonly FactStaging $staging,
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

            foreach ($unit->stagedBatch() as $occurrence) {
                $this->deliver($occurrence->event, $occurrence->staged);
            }
        }
    }

    private function deliver(Event $event, object|null $staged): void
    {
        try {
            $this->staging->deliver($event, $staged);
        } catch (Throwable $failure) {
            $this->log->error('A listener of a committed fact failed.', [
                'event' => $event::class,
                'listener_failure' => $failure::class,
            ]);
        }
    }
}
