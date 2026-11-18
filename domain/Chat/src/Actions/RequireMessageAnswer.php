<?php

declare(strict_types=1);

namespace Domain\Chat\Actions;

use App\Agents\Support\StackTarget;
use App\Hooks\Contracts\StackTransactionRunner;
use Domain\Chat\Events\MessageNeedsAnswer;
use Domain\Chat\Models\Message;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Asks an agent to answer a message: the request and the push of its state commit together in one stack transaction.
 */
final readonly class RequireMessageAnswer
{
    public function __construct(
        private StackTransactionRunner $transaction,
        private Dispatcher $events,
    ) {}

    public function require(Message $message, StackTarget $target): void
    {
        $this->transaction->run(function () use ($message, $target): void {
            $message->requireAnswerFrom($target);

            $this->events->dispatch(new MessageNeedsAnswer($message->id, $target));
        });
    }
}
