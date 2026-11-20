<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Commands\ReviseRuleProposal;
use App\Processes\Exceptions\RequestTransitionRefused;
use App\Processes\Exceptions\RuleProposalRefused;
use App\Processes\Models\RuleProposal;
use App\Processes\Support\ProposalChecks;
use App\Processes\Values\ProposalReceipt;

/**
 * Adds the author's next revision; the request the proposal answers starts collecting again from it.
 */
final readonly class ReviseRuleProposalHandler implements CommandHandler
{
    public function __construct(private ProposalChecks $checks) {}

    /**
     * @throws RuleProposalRefused
     * @throws RequestTransitionRefused
     */
    public function handle(ReviseRuleProposal $command): ProposalReceipt
    {
        $actor = ActorIdentity::of($command->dispatchedBy());
        $proposal = RuleProposal::query()->whereKey($command->proposalId)->lockForUpdate()->sole();
        $request = $proposal->commandRequest()->lockForUpdate()->first();
        $this->checks->check($command->proposed->rule, $request !== null && $request->hold_reason->needsReader());
        $proposal->revise($command->expectedRevision, $command->proposed, $actor);

        if ($request !== null) {
            $request->answerWith($proposal);
        }

        return ProposalReceipt::of($proposal, $command->proposed);
    }
}
