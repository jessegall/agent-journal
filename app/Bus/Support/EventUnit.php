<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\Contracts\FactStaging;
use App\Bus\Exceptions\EventUnitRefused;
use App\Contracts\Event;
use App\Contracts\EventSource;
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
     * The command depth the open slot was opened at, and the depth of the command running now.
     */
    private int $openDepth = 0;

    private int $depth = 0;

    /**
     * The facts held back from the drain until their operation ends, by the command depth whose scope holds them.
     *
     * @var array<int, list<array{event: Event, chain: list<string>, staged: object|null}>>
     */
    private array $held = [];

    /**
     * @var list<array{event: Event, chain: list<string>, staged: object|null}>
     */
    private array $pending = [];

    /**
     * @var list<array{event: Event, staged: object|null}>
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
        $this->openDepth = $this->depth;
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
            $occurrence = ['event' => $event, 'chain' => $this->cause, 'staged' => $this->staging?->stage($event)];

            if (isset($this->held[$this->openDepth])) {
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
        $this->pending[] = ['event' => $event, 'chain' => $this->cause, 'staged' => $this->staging?->stage($event)];
    }

    /**
     * Runs a command's work one level deeper, so its saves are not held by a scope of the level around it.
     *
     * @template TResult
     *
     * @param  callable(): TResult  $work
     * @return TResult
     */
    public function deeper(callable $work): mixed
    {
        $this->depth++;

        try {
            return $work();
        } finally {
            $this->depth--;
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
        if (isset($this->held[$this->depth])) {
            return $work();
        }

        $level = $this->depth;
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
     * The oldest pending fact with its chain, taken off the queue, or none when nothing waits.
     *
     * @return array{event: Event, chain: list<string>, staged: object|null}|null
     */
    public function takePending(): array|null
    {
        return array_shift($this->pending);
    }

    /**
     * Runs the work with the fact's chain as the cause of what its listeners raise, and adds the fact to the batch.
     *
     * @param  array{event: Event, chain: list<string>, staged: object|null}  $occurrence
     * @param  list<string>  $chain  the fact's chain, itself included
     * @param  callable(): void  $work
     */
    public function drain(array $occurrence, array $chain, callable $work): void
    {
        $this->cause = $chain;

        try {
            $work();
            $this->seal();
        } finally {
            $this->cause = [];
        }

        $this->batch[] = ['event' => $occurrence['event'], 'staged' => $occurrence['staged']];
    }

    /**
     * Holds the pump for the work, so a call made while it already runs returns at once.
     *
     * @param  callable(): void  $work
     */
    public function pump(callable $work): void
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
        return array_column($this->batch, 'event');
    }

    /**
     * The drained facts in their order, each with the delivery context staged for it.
     *
     * @return list<array{event: Event, staged: object|null}>
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
