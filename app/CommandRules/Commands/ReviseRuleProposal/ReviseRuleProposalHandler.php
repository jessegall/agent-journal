<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\ReviseRuleProposal;

use App\Bus\Contracts\CommandHandler;
use App\CommandRules\Exceptions\RequestTransitionRefused;
use App\CommandRules\Exceptions\RuleProposalRefused;
use App\CommandRules\ProposalChecks;
use App\CommandRules\RuleProposals;
use App\CommandRules\Values\ProposalReceipt;
use App\Models\CommandRules\RuleProposal;

/**
 * Adds the author's next revision; the request the proposal answers starts collecting again from it.
 */
final readonly class ReviseRuleProposalHandler implements CommandHandler
{
    public function __construct(private ProposalChecks $checks, private RuleProposals $proposals) {}

    /**
     * @throws RuleProposalRefused
     * @throws RequestTransitionRefused
     */
    public function handle(ReviseRuleProposalCommand $command): ProposalReceipt
    {
        $actor = $command->dispatchedBy();
        $proposal = RuleProposal::query()->whereKey($command->proposalId)->lockForUpdate()->sole();
        $request = $proposal->commandRequest()->lockForUpdate()->first();
        $this->checks->check($command->proposed->rule, $request !== null && $request->hold_reason->needsReader());
        $this->proposals->revise($proposal, $command->expectedRevision, $command->proposed, $actor);

        if ($request !== null) {
            $request->answerWith($proposal);
        }

        return ProposalReceipt::of($proposal, $command->proposed);
    }
}
