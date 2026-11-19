<?php

declare(strict_types=1);

namespace App\Communication\Handlers;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Contracts\TargetAuthorizer;
use App\Communication\Commands\RequireMessageAnswer;
use App\Communication\Contracts\MessageAddressResolver;
use App\Communication\Enums\MessageAbility;
use App\Communication\Events\MessageNeedsAnswer;
use App\Communication\Models\Message;
use App\Communication\Policies\MessagePolicy;
use App\Contracts\CommandHandler;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Resolves the session after every middleware, then asks its agent for the answer under the message's row lock.
 */
final readonly class RequireMessageAnswerHandler implements CommandHandler
{
    public function __construct(
        private CurrentAuthorizer $authorizer,
        private MessageAddressResolver $addresses,
        private TargetAuthorizer $targets,
        private Dispatcher $events,
    ) {}

    public function handle(RequireMessageAnswer $command): void
    {
        $message = Message::lockedById($command->messageId);
        $this->authorizer->authorize(MessagePolicy::class, $message, MessageAbility::RequireAnswer);
        $this->addresses->requireReceiver($command->recipient);
        $message->requireRound($command->currentRound);
        $message->requireAnswerFrom($command->recipient);
        $this->targets->authorize($command->recipient, MessagePolicy::class, $message, MessageAbility::Answer);
        $this->events->dispatch(new MessageNeedsAnswer($command->messageId, $command->recipient, $message->answer_round));
    }
}
