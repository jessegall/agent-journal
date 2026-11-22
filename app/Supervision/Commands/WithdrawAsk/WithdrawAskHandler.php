<?php

declare(strict_types=1);

namespace App\Supervision\Commands\WithdrawAsk;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\JournalAssignmentWriter;
use App\Contracts\CommandHandler;
use App\Supervision\Exceptions\AskRefused;
use App\Supervision\Support\AskRecords;
use App\Supervision\Values\AskReference;

final readonly class WithdrawAskHandler implements CommandHandler
{
    public function __construct(
        private AskRecords $asks,
        private JournalAssignmentWriter $assignments,
    ) {}

    public function handle(WithdrawAskCommand $command): AskReference
    {
        $ask = $this->asks->lock($command->ask);
        $actor = ActorIdentity::of($command->dispatchedBy());

        if (! $ask->open || ! $ask->actor()->isSameAs($actor)) {
            throw AskRefused::cannotWithdraw();
        }

        $this->assignments->releaseForJournal($ask->assignmentIdentity());
        $ask->close();

        return $command->ask;
    }
}
