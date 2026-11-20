<?php

declare(strict_types=1);

namespace App\Supervision\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\JournalAssignmentWriter;
use App\Contracts\CommandHandler;
use App\Supervision\Commands\ReplyToAsk;
use App\Supervision\Contracts\AskAdmission;
use App\Supervision\Enums\CoreAskType;
use App\Supervision\Exceptions\AskRefused;
use App\Supervision\Models\Ask;
use App\Supervision\Models\AskHop;
use App\Supervision\Support\AskAttention;
use App\Supervision\Support\AskRecords;
use App\Supervision\Support\SupervisorOwner;
use App\Supervision\Values\AskReference;

final readonly class ReplyToAskHandler implements CommandHandler
{
    public function __construct(
        private AskRecords $asks,
        private AskAdmission $admission,
        private JournalAssignmentWriter $assignments,
        private AskAttention $attention,
        private SupervisorOwner $owner,
    ) {}

    public function handle(ReplyToAsk $command): AskReference
    {
        $body = trim($command->body);
        AskRefused::assertValidBody($body);
        $ask = $this->asks->lock($command->ask);

        if ($ask->isUnanswered()) {
            return $this->answerLate($ask, ActorIdentity::of($command->dispatchedBy()), $body);
        }

        $this->admission->requireCurrent($command->ask, CoreAskType::Question->requiredCommand(), $ask->version);

        $hop = AskHop::currentFor($ask);
        $this->attention->retainReply($ask, $hop, $body);
        $this->assignments->releaseForJournal($ask->assignmentIdentity());
        $ask->close();
        $this->attention->finishAnswering($hop->actor());

        return $command->ask;
    }

    /**
     * The owner's late text on an unanswered ask; its outcome stays, and nothing an expiry ended comes back.
     */
    private function answerLate(Ask $ask, ActorIdentity $actor, string $body): AskReference
    {
        if (! $this->owner->resolve()->endsAt($actor)) {
            throw AskRefused::onlyOwnerAnswersLate();
        }

        $ask->answerLate($body);

        return $ask->reference();
    }
}
