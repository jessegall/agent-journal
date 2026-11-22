<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Reviews\Messaging;

use App\Contracts\CurrentActor;
use App\Support\AssigneeIdentity;
use App\Contracts\CommandBus;
use App\Commands\AskMessage\AskMessageCommand;
use App\Contracts\ActorInboxResolver;
use App\Contracts\ConversationResolver;
use App\Contracts\InboxDestinationResolver;
use App\Data\MessageView;

/**
 * A domain asking an assignee for a review through Core alone: the asker's own inbox, the assignee's resolved inbox,
 * the ask command and the message read back, with no desk model and no Chat type.
 */
final readonly class ReviewRequests
{
    public function __construct(
        private CurrentActor $actors,
        private ActorInboxResolver $ownInboxes,
        private InboxDestinationResolver $destinations,
        private CommandBus $commands,
        private ConversationResolver $conversations,
    ) {}

    public function ask(AssigneeIdentity $reviewer, string $question): MessageView
    {
        $source = $this->ownInboxes->preferredFor($this->actors->actor());
        $destination = $this->destinations->resolve($reviewer);
        $messageId = $this->commands->run(new AskMessageCommand($source->inboxId(), $destination->inboxId(), $question));

        return $this->conversations->detail($messageId);
    }
}
