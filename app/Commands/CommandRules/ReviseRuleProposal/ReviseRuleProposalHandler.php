<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\ReviseRuleProposal;

use App\Contracts\Bus\CommandHandler;
use App\Exceptions\RequestTransitionRefused;
use App\Exceptions\RuleProposalRefused;
use App\Models\CommandRules\RuleProposal;
use App\Support\ActorIdentity;
use App\Support\ProposalChecks;
use App\Support\RuleProposals;
use App\Values\ProposalReceipt;

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
        $actor = ActorIdentity::of($command->dispatchedBy());
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
