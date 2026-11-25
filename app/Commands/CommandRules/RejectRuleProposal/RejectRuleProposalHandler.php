<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\RejectRuleProposal;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Events\Processes\RuleRejected;
use App\Exceptions\RequestTransitionRefused;
use App\Exceptions\RuleProposalRefused;
use App\Models\CommandRules\RuleProposal;
use App\Support\ServedEnvironment;

final readonly class RejectRuleProposalHandler implements CommandHandler
{
    public function __construct(
        private CommandFacts $facts,
        private ServedEnvironment $projects,
    ) {}

    /**
     * @throws RuleProposalRefused
     * @throws RequestTransitionRefused
     */
    public function handle(RejectRuleProposalCommand $command): string
    {
        $proposal = RuleProposal::query()
            ->ofProject($this->projects->current())
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

        return $proposal->id;
    }
}
