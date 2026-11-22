<?php

declare(strict_types=1);

namespace App\Commands\ReplyToAsk;

use App\Contracts\AskAdmission;
use App\Contracts\CommandHandler;
use App\Contracts\JournalAssignmentWriter;
use App\Enums\CoreAskType;
use App\Exceptions\AskRefused;
use App\Models\Ask;
use App\Models\AskHop;
use App\Support\ActorIdentity;
use App\Support\AskAttention;
use App\Support\AskRecords;
use App\Support\SupervisorOwner;
use App\Values\AskReference;

final readonly class ReplyToAskHandler implements CommandHandler
{
    public function __construct(
        private AskRecords $asks,
        private AskAdmission $admission,
        private JournalAssignmentWriter $assignments,
        private AskAttention $attention,
        private SupervisorOwner $owner,
    ) {}

    public function handle(ReplyToAskCommand $command): AskReference
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
