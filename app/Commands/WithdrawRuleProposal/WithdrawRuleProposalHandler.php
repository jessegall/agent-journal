<?php

declare(strict_types=1);

namespace App\Commands\WithdrawRuleProposal;

use App\Contracts\Bus\CommandHandler;
use App\Exceptions\RuleProposalRefused;
use App\Models\RuleProposal;
use App\Support\ActorIdentity;

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
