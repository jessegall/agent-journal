<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\RejectRuleProposal;

use App\Bus\Contracts\CommandFacts;
use App\Bus\Contracts\CommandHandler;
use App\CommandRules\Exceptions\RequestTransitionRefused;
use App\CommandRules\Exceptions\RuleProposalRefused;
use App\Events\Processes\RuleRejected;
use App\Models\CommandRules\RuleProposal;

final readonly class RejectRuleProposalHandler implements CommandHandler
{
    public function __construct(private CommandFacts $facts) {}

    /**
     * @throws RuleProposalRefused
     * @throws RequestTransitionRefused
     */
    public function handle(RejectRuleProposalCommand $command): string
    {
        $proposal = RuleProposal::query()
            ->whereKey($command->proposalId)
            ->lockForUpdate()
            ->sole();

        $proposal->reject();
        $request = $proposal->commandRequest()->lockForUpdate()->first();

        if ($request !== null) {
            $request->reject();
        }

        $rejected = RuleRejected::forProposal($proposal, $command->reason);
        $this->facts->publishAfterCommit($rejected);

        return $proposal->getKey();
    }
}
