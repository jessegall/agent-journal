<?php

declare(strict_types=1);

namespace App\Commands\WithdrawAsk;

use App\Contracts\Assignments\JournalAssignmentWriter;
use App\Contracts\Bus\CommandHandler;
use App\Exceptions\AskRefused;
use App\Support\ActorIdentity;
use App\Support\AskRecords;
use App\Values\AskReference;

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
