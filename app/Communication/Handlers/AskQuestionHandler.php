<?php

declare(strict_types=1);

namespace App\Communication\Handlers;

use App\Actors\Contracts\JournalAdmission;
use App\Communication\Commands\AskQuestion;
use App\Communication\Contracts\ActorInboxResolver;
use App\Communication\Support\MessageSending;
use App\Contracts\CommandHandler;
use App\Records\Contracts\RecordResolver;

final readonly class AskQuestionHandler implements CommandHandler
{
    public function __construct(
        private JournalAdmission $admission,
        private ActorInboxResolver $inboxes,
        private MessageSending $sending,
        private RecordResolver $records,
    ) {}

    public function handle(AskQuestion $command): string
    {
        $author = $command->dispatchedBy();
        $related = $command->relatedRecord === null ? null : $this->records->requireReadable($command->relatedRecord);
        $message = $this->sending->question(
            $this->inboxes->preferredFor($author)->inboxId(),
            $this->inboxes->preferredFor($this->admission->owner())->inboxId(),
            $command->body,
            $author,
        );

        if ($related !== null) {
            $message->linkTo($related);
        }

        return $message->id;
    }
}
