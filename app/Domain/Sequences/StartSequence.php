<?php

declare(strict_types=1);

namespace App\Domain\Sequences;

use App\Core\Hooks\Contracts\StackWork;
use App\Core\Hooks\StackTarget;
use App\Domain\Sequences\Events\SequenceStarted;
use App\Domain\Sequences\Models\SequenceRun;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Starts a sequence run for an agent: the start and the push of its state commit together in one stack transaction.
 */
final readonly class StartSequence
{
    public function __construct(
        private StackWork $transaction,
        private Dispatcher $events,
    ) {}

    public function start(SequenceRun $run, StackTarget $target): void
    {
        $this->transaction->run(function () use ($run, $target): void {
            $run->startFor($target);

            $this->events->dispatch(new SequenceStarted($run->id, $target));
        });
    }
}
