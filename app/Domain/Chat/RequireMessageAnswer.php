<?php

declare(strict_types=1);

namespace App\Domain\Chat;

use App\Domain\Chat\Events\MessageNeedsAnswer;
use App\Domain\Chat\Models\Message;
use App\Domain\Hooks\StackTransaction;
use App\Domain\Hooks\Storage\StackTarget;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Asks an agent to answer a message: the request and the push of its state commit together in one stack transaction.
 */
final readonly class RequireMessageAnswer
{
    public function __construct(
        private StackTransaction $transaction,
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
