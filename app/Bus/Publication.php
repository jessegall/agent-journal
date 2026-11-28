<?php

declare(strict_types=1);

namespace App\Bus;

use App\Bus\Contracts\CommittedListenerFailures;
use App\Bus\Contracts\Events\FactStaging;
use App\Bus\Exceptions\CommittedFactListenerFailed;
use App\Contracts\Events\Event;
use Throwable;

/**
 * Releases the facts of committed event units once no command of the request runs, each once and in order, through
 * Laravel's dispatcher. A listener's failure never rolls back the producer or stops the facts after it; once all are
 * out, the first failure is thrown.
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
        private readonly CommittedListenerFailures $failed,
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
     * Releases every committed unit's facts, oldest unit first; a listener that failed is handed on once all ran.
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

        foreach ($failures as $failure) {
            $this->failed->take($failure);
        }
    }

    /**
     * Takes the failure of one listener: during a release it waits until every fact was handed out, so the listeners
     * and facts after it still run; outside one it is handed on at once.
     */
    public function fail(CommittedFactListenerFailed $failure): void
    {
        if (! $this->isReleasing) {
            $this->failed->take($failure);

            return;
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
