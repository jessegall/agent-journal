<?php

declare(strict_types=1);

namespace App\Commands\Asks\ReplyToAsk;

use App\Contracts\Admission\AskAdmission;
use App\Contracts\Assignments\JournalAssignmentWriter;
use App\Contracts\Bus\CommandHandler;
use App\Enums\Asks\CoreAskType;
use App\Exceptions\AskRefused;
use App\Models\Asks\Ask;
use App\Models\Asks\AskHop;
use App\Support\ActorReference;
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
            return $this->answerLate($ask, $command->dispatchedBy(), $body);
        }

        $this->admission->requireCurrent($command->ask, CoreAskType::Question->requiredCommand(), $ask->version);

        $hop = AskHop::findCurrentFor($ask);
        $this->attention->retainReply($ask, $hop, $body);
        $this->assignments->releaseForJournal($ask->assignmentIdentity());
        $ask->close();

        return $command->ask;
    }

    /**
     * The owner's late text on an unanswered ask; its outcome stays, and nothing an expiry ended comes back.
     */
    private function answerLate(Ask $ask, ActorReference $actor, string $body): AskReference
    {
        if (! $this->owner->resolve()->endsAt($actor)) {
            throw AskRefused::onlyOwnerAnswersLate();
        }

        $ask->answerLate($body);

        return $ask->reference;
    }
}
