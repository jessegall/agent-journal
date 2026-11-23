<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Events\Event;
use App\Contracts\Events\FactStaging;
use App\Exceptions\CommittedFactListenerFailed;
use Throwable;

/**
 * Releases the facts of committed event units once no command of the request still runs: each occurrence in its
 * order, once, through the fact staging and Laravel's dispatcher, so wildcard, queued and broadcast listeners and a
 * test's fake see only committed facts. A listener's failure never rolls back the committed producer and never stops
 * the occurrences after it; once all are handed out, the first failure is thrown, so none is dropped silently.
 */
final class Publication
{
    /**
     * @var list<EventUnit>
     */
    private array $committed = [];

    /**
     * @var list<CommittedFactListenerFailed>
     */
    private array $failures = [];

    private bool $isReleasing = false;

    public function __construct(
        private readonly CommandNesting $nesting,
        private readonly FactStaging $staging,
    ) {}

    /**
     * Takes a unit whose batch is ready, and releases it at once when no command runs.
     */
    public function takeCommitted(EventUnit $unit): void
    {
        $this->committed[] = $unit;

        if ($this->nesting->isEmpty()) {
            $this->release();
        }
    }

    /**
     * Releases every committed unit's facts, oldest unit first.
     *
     * @throws CommittedFactListenerFailed
     */
    public function release(): void
    {
        $this->isReleasing = true;

        try {
            while ($this->committed !== []) {
                $unit = array_shift($this->committed);

                foreach ($unit->stagedBatch() as $occurrence) {
                    $this->deliver($occurrence->event, $occurrence->staged);
                }
            }
        } finally {
            $this->isReleasing = false;
        }

        $failures = $this->failures;
        $this->failures = [];

        if ($failures !== []) {
            throw $failures[0];
        }
    }

    /**
     * Takes the failure of one listener: during a release it waits until every fact was handed out, so the listeners
     * and facts after it still run; outside one it is thrown at once.
     *
     * @throws CommittedFactListenerFailed
     */
    public function fail(CommittedFactListenerFailed $failure): void
    {
        if (! $this->isReleasing) {
            throw $failure;
        }

        $this->failures[] = $failure;
    }

    private function deliver(Event $event, object|null $staged): void
    {
        try {
            $this->staging->deliver($event, $staged);
        } catch (CommittedFactListenerFailed $failure) {
            $this->failures[] = $failure;
        } catch (Throwable $failure) {
            $this->failures[] = CommittedFactListenerFailed::for($event::class, $failure);
        }
    }
}
