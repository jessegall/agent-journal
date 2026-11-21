<?php

declare(strict_types=1);

namespace App\Bus\Support;

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
     * @var list<array{event: Event, chain: list<string>}>
     */
    private array $pending = [];

    /**
     * @var list<Event>
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

    /**
     * Seals the slot before it and opens one for the row; facts the row held from before this unit are dropped.
     */
    public function openSlot(EventSource $row): void
    {
        $this->seal();
        $row->takeRaisedEvents();
        $this->open = $row;
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
            $this->pending[] = ['event' => $event, 'chain' => $this->cause];
        }

        $this->open = null;
    }

    /**
     * The oldest pending fact with its chain, taken off the queue, or none when nothing waits.
     *
     * @return array{event: Event, chain: list<string>}|null
     */
    public function takePending(): array|null
    {
        return array_shift($this->pending);
    }

    /**
     * Runs the work with the fact's chain as the cause of what its listeners raise, and adds the fact to the batch.
     *
     * @param  list<string>  $chain  the fact's chain, itself included
     * @param  callable(): void  $work
     */
    public function drain(Event $event, array $chain, callable $work): void
    {
        $this->cause = $chain;

        try {
            $work();
            $this->seal();
        } finally {
            $this->cause = [];
        }

        $this->batch[] = $event;
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
        $this->batch = [];
    }
}
