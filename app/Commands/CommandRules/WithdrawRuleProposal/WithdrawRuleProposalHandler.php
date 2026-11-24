<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\WithdrawRuleProposal;

use App\Contracts\Bus\CommandHandler;
use App\Exceptions\RuleProposalRefused;
use App\Models\CommandRules\RuleProposal;
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
