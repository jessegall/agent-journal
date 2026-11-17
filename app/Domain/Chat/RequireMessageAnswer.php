<?php

declare(strict_types=1);

namespace App\Domain\Chat;

use App\Core\Hooks\Contracts\StackWork;
use App\Core\Hooks\StackTarget;
use App\Domain\Chat\Events\MessageNeedsAnswer;
use App\Domain\Chat\Models\Message;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Asks an agent to answer a message: the request and the push of its state commit together in one stack transaction.
 */
final readonly class RequireMessageAnswer
{
    public function __construct(
        private StackWork $transaction,
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
