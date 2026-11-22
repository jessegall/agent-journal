<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Event;
use App\Contracts\EventSource;
use App\Contracts\FactStaging;
use App\Exceptions\EventUnitRefused;
use Throwable;

/**
 * The facts one physical transaction's saves raised, in save order. Each save opens a slot for its row and seals the
 * slot before it, so only the row saved last is held; a sealed slot keeps only its immutable facts, each with the
 * chain of facts whose required listeners raised it. Drained facts wait in the public batch for release.
 */
final class EventUnit
{
    private EventSource|null $open = null;

    /**
     * What stages each fact's delivery context as it is sealed, while its command's admission is open.
     */
    private FactStaging|null $staging;

    /**
     * The command depth the open slot was opened at.
     */
    private int $openDepth = 0;

    /**
     * One entry for each command running one level deeper than the unit's owner, so its count is the depth now.
     *
     * @var list<true>
     */
    private array $levels = [];

    /**
     * The facts held back from the drain until their operation ends, by the command depth whose scope holds them.
     *
     * @var array<int, list<Occurrence>>
     */
    private array $held = [];

    /**
     * @var list<Occurrence>
     */
    private array $pending = [];

    /**
     * @var list<Occurrence>
     */
    private array $batch = [];

    /**
     * The chain of facts whose required listeners run now, which the facts they raise extend.
     *
     * @var list<string>
     */
    private array $cause = [];

    private bool $draining = false;

    private bool $failed = false;

    private bool $ready = false;

    public function __construct(FactStaging|null $staging = null)
    {
        $this->staging = $staging;
    }

    /**
     * Seals the slot before it and opens one for the row; facts the row held from before this unit are dropped.
     */
    public function openSlot(EventSource $row): void
    {
        $this->seal();
        $row->takeRaisedEvents();
        $this->open = $row;
        $this->openDepth = count($this->levels);
    }

    /**
     * Moves the open slot's facts to the pending ones and lets go of its row.
     */
    public function seal(): void
    {
        if ($this->open === null) {
            return;
        }

        foreach ($this->open->takeRaisedEvents() as $event) {
            $occurrence = new Occurrence($event, $this->cause, $this->staging?->stage($event));

            if (array_key_exists($this->openDepth, $this->held)) {
                $this->held[$this->openDepth][] = $occurrence;
            } else {
                $this->pending[] = $occurrence;
            }
        }

        $this->open = null;
    }

    /**
     * Puts a fact with no row to raise on in the queue at this point, after the facts the saves before it raised.
     */
    public function stage(Event $event): void
    {
        $this->seal();
        $this->pending[] = new Occurrence($event, $this->cause, $this->staging?->stage($event));
    }

    /**
     * Runs a command's work one level deeper, so its saves are not held by a scope of the level around it.
     *
     * @template TResult
     *
     * @param  callable(): TResult  $work
     * @return TResult
     */
    public function runNested(callable $work): mixed
    {
        $this->levels[] = true;

        try {
            return $work();
        } finally {
            array_pop($this->levels);
        }
    }

    /**
     * Holds the facts this level's saves raise while the work runs: a drain inside it, a nested scope or a nested
     * command never releases them. They join the end of the queue when the work returns and are dropped when it
     * throws; a scope already holding this level adds nothing.
     *
     * @template TResult
     *
     * @param  callable(): TResult  $work
     * @return TResult
     */
    public function hold(callable $work): mixed
    {
        $level = count($this->levels);

        if (array_key_exists($level, $this->held)) {
            return $work();
        }

        $this->held[$level] = [];

        try {
            $result = $work();
            $this->seal();
            array_push($this->pending, ...$this->held[$level]);

            return $result;
        } finally {
            $this->seal();
            unset($this->held[$level]);
        }
    }

    /**
     * Whether a sealed fact waits for the drain.
     */
    public function hasPending(): bool
    {
        return $this->pending !== [];
    }

    /**
     * The oldest pending fact, taken off the queue.
     *
     * @throws EventUnitRefused
     */
    public function takePending(): Occurrence
    {
        return array_shift($this->pending) ?? throw EventUnitRefused::nothingPending();
    }

    /**
     * Runs the work with the fact's chain as the cause of what its listeners raise, and adds the fact to the batch.
     *
     * @param  callable(): void  $work
     */
    public function drain(Occurrence $occurrence, callable $work): void
    {
        $this->cause = $occurrence->chainWithItself();

        try {
            $work();
            $this->seal();
        } finally {
            $this->cause = [];
        }

        $this->batch[] = $occurrence;
    }

    /**
     * Holds the pump for the work, so a call made while it already runs returns at once.
     *
     * @param  callable(): void  $work
     */
    public function runUnlessDraining(callable $work): void
    {
        if ($this->draining) {
            return;
        }

        $this->draining = true;

        try {
            $work();
        } catch (Throwable $failure) {
            $this->failed = true;

            throw $failure;
        } finally {
            $this->draining = false;
        }
    }

    /**
     * The drained facts in their order, waiting for release after the commit.
     *
     * @return list<Event>
     */
    public function batch(): array
    {
        return array_map(fn (Occurrence $occurrence) => $occurrence->event, $this->batch);
    }

    /**
     * The drained facts in their order, each with the delivery context staged for it.
     *
     * @return list<Occurrence>
     */
    public function stagedBatch(): array
    {
        return $this->batch;
    }

    public function hasFailed(): bool
    {
        return $this->failed;
    }

    /**
     * Marks the unit failed: a failure crossed a command of its transaction, so it may not commit.
     */
    public function markFailed(): void
    {
        $this->failed = true;
    }

    /**
     * Marks the batch ready for release after the known commit, once.
     *
     * @throws EventUnitRefused
     */
    public function markReady(): void
    {
        if ($this->ready) {
            throw EventUnitRefused::readyTwice();
        }

        $this->ready = true;
    }

    public function isReady(): bool
    {
        return $this->ready;
    }

    /**
     * Drops every fact after a rollback: the batch, the pending ones and those the open slot's row still holds.
     */
    public function erase(): void
    {
        $this->open?->takeRaisedEvents();
        $this->open = null;
        $this->pending = [];
        $this->held = [];
        $this->batch = [];
    }
}
