<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\WithdrawRuleProposal;

use App\Bus\Contracts\CommandHandler;
use App\CommandRules\Exceptions\RuleProposalRefused;
use App\Models\CommandRules\RuleProposal;

final readonly class WithdrawRuleProposalHandler implements CommandHandler
{
    /**
     * @throws RuleProposalRefused
     */
    public function handle(WithdrawRuleProposalCommand $command): string
    {
        $proposal = RuleProposal::query()->whereKey($command->proposalId)->lockForUpdate()->sole();
        $proposal->withdraw($command->dispatchedBy());

        return $proposal->getKey();
    }
}
