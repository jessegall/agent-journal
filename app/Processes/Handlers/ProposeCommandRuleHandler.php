<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Commands\ProposeCommandRule;
use App\Processes\Exceptions\RequestTransitionRefused;
use App\Processes\Exceptions\RuleProposalRefused;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\RuleProposal;
use App\Processes\Support\ProcessAdministration;
use App\Processes\Support\ProposalChecks;
use App\Processes\Values\ProposalReceipt;

/**
 * Opens the proposal and its first revision in the request's project, and moves the request on once the proposal is
 * complete. A command already known as a test, check or build keeps its contract: it cannot be relabelled to skip its
 * reader.
 */
final readonly class ProposeCommandRuleHandler implements CommandHandler
{
    public function __construct(private ProcessAdministration $administration, private ProposalChecks $checks) {}

    /**
     * @throws RuleProposalRefused
     * @throws RequestTransitionRefused
     */
    public function handle(ProposeCommandRule $command): ProposalReceipt
    {
        $actor = ActorIdentity::of($command->dispatchedBy());
        $request = CommandRequest::lockedForChange($command->commandRequestId);
        if (! $request->acceptsProposalFrom($actor, $this->administration->isGrantedToCaller())) {
            throw RuleProposalRefused::notTheRequester($request->id);
        }
        $this->checks->check($command->proposed->rule, $request->hold_reason->needsReader());

        $proposal = RuleProposal::open(
            $request->project_key,
            $actor,
            $command->requestId,
            $command->proposed,
            $request,
        );
        if ($proposal->wasRecentlyCreated) {
            $request->answerWith($proposal);
        }

        return ProposalReceipt::of($proposal, $command->proposed);
    }
}
