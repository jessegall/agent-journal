<?php

declare(strict_types=1);

namespace App\Processes\Commands\WithdrawRuleProposal;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Exceptions\RuleProposalRefused;
use App\Processes\Models\RuleProposal;

final readonly class WithdrawRuleProposalHandler implements CommandHandler
{
    /**
     * @throws RuleProposalRefused
     */
    public function handle(WithdrawRuleProposalCommand $command): string
    {
        $proposal = RuleProposal::query()->whereKey($command->proposalId)->lockForUpdate()->sole();
        $proposal->withdraw(ActorIdentity::of($command->dispatchedBy()));

        return $proposal->id;
    }
}
