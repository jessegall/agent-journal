<?php

declare(strict_types=1);

namespace App\Processes\Commands\RejectRuleProposal;

use App\Bus\Contracts\CommandFacts;
use App\Contracts\CommandHandler;
use App\Processes\Events\RuleRejected;
use App\Processes\Exceptions\RequestTransitionRefused;
use App\Processes\Exceptions\RuleProposalRefused;
use App\Processes\Models\RuleProposal;
use App\Processes\Support\ProjectKey;

final readonly class RejectRuleProposalHandler implements CommandHandler
{
    public function __construct(
        private CommandFacts $facts,
        private ProjectKey $projects,
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
