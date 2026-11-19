<?php

declare(strict_types=1);

namespace App\Communication\Handlers;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Communication\Commands\DismissMessage;
use App\Communication\Enums\MessageAbility;
use App\Communication\Events\MessageDismissed;
use App\Communication\Models\Message;
use App\Communication\Policies\MessagePolicy;
use App\Contracts\CommandHandler;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Dismisses the message under its row lock and tells listeners once that has committed.
 */
final readonly class DismissMessageHandler implements CommandHandler
{
    public function __construct(
        private CurrentAuthorizer $authorizer,
        private Dispatcher $events,
    ) {}

    public function handle(DismissMessage $command): void
    {
        $message = Message::lockedById($command->messageId);
        $this->authorizer->authorize(MessagePolicy::class, $message, MessageAbility::Dismiss);
        $message->requireRound($command->round);
        $message->dismiss();
        $this->events->dispatch(new MessageDismissed($command->messageId));
    }
}
