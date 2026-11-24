<?php

declare(strict_types=1);

namespace App\Commands\Messages\AskQuestion;

use App\Contracts\Actors\ActorInboxResolver;
use App\Contracts\Admission\JournalAdmission;
use App\Contracts\Bus\CommandHandler;
use App\Contracts\Records\RecordResolver;
use App\Models\Records\Link;
use App\Support\MessageService;

final readonly class AskQuestionHandler implements CommandHandler
{
    public function __construct(
        private JournalAdmission $admission,
        private ActorInboxResolver $inboxes,
        private MessageService $messages,
        private RecordResolver $records,
    ) {}

    public function handle(AskQuestionCommand $command): string
    {
        $author = $command->dispatchedBy();
        $related = $command->relatedRecord === null ? null : $this->records->requireReadable($command->relatedRecord);

        $message = $this->messages->question(
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
