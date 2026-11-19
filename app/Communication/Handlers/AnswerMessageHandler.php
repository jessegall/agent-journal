<?php

declare(strict_types=1);

namespace App\Communication\Handlers;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Communication\Commands\AnswerMessage;
use App\Communication\Enums\MessageAbility;
use App\Communication\Events\MessageAnswered;
use App\Communication\Models\Message;
use App\Communication\Policies\MessagePolicy;
use App\Contracts\CommandHandler;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Marks the message answered under its row lock and tells listeners once that has committed.
 */
final readonly class AnswerMessageHandler implements CommandHandler
{
    public function __construct(
        private CurrentAuthorizer $authorizer,
        private Dispatcher $events,
    ) {}

    public function handle(AnswerMessage $command): void
    {
        $message = Message::lockedById($command->messageId);
        $this->authorizer->authorize(MessagePolicy::class, $message, MessageAbility::Answer);
        $message->requireRound($command->round);
        $message->markAnswered();
        $this->events->dispatch(new MessageAnswered($command->messageId));
    }
}
