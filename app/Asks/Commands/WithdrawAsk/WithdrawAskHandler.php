<?php

declare(strict_types=1);

namespace App\Asks\Commands\WithdrawAsk;

use App\Asks\AskRecords;
use App\Asks\Exceptions\AskRefused;
use App\Assignments\Contracts\JournalAssignmentWriter;
use App\Bus\Contracts\CommandHandler;
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
        $actor = $command->dispatchedBy();

        if (! $ask->open || ! $ask->actor()->isSameAs($actor)) {
            throw AskRefused::cannotWithdraw();
        }

        $this->assignments->releaseForJournal($ask->assignmentIdentity());
        $ask->close();

        return $command->ask;
    }
}
