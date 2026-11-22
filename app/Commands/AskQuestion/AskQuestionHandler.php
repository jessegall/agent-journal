<?php

declare(strict_types=1);

namespace App\Commands\AskQuestion;

use App\Contracts\Actors\ActorInboxResolver;
use App\Contracts\Admission\JournalAdmission;
use App\Contracts\Bus\CommandHandler;
use App\Contracts\Records\RecordResolver;
use App\Models\Link;
use App\Support\MessageSending;

final readonly class AskQuestionHandler implements CommandHandler
{
    public function __construct(
        private JournalAdmission $admission,
        private ActorInboxResolver $inboxes,
        private MessageSending $sending,
        private RecordResolver $records,
    ) {}

    public function handle(AskQuestionCommand $command): string
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
            Link::connect($message, $related);
        }

        return $message->id;
    }
}
