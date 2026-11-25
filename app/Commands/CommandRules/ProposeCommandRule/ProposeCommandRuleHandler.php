<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\ProposeCommandRule;

use App\Contracts\Bus\CommandHandler;
use App\Exceptions\RequestTransitionRefused;
use App\Exceptions\RuleProposalRefused;
use App\Models\CommandRules\CommandRequest;
use App\Support\ProcessAdministration;
use App\Support\ProposalChecks;
use App\Support\RuleProposals;
use App\Values\ProposalReceipt;

/**
 * Opens the proposal and its first revision in the request's project, and moves the request on once the proposal is
 * complete. A command already known as a test, check or build keeps its contract: it cannot be relabelled to skip its
 * reader.
 */
final readonly class ProposeCommandRuleHandler implements CommandHandler
{
    public function __construct(
        private ProcessAdministration $administration,
        private ProposalChecks $checks,
        private RuleProposals $proposals,
    ) {}

    /**
     * @throws RuleProposalRefused
     * @throws RequestTransitionRefused
     */
    public function handle(ProposeCommandRuleCommand $command): ProposalReceipt
    {
        $actor = $command->dispatchedBy();
        $request = CommandRequest::findLockedForChange($command->commandRequestId);

        if (! $request->acceptsProposalFrom($actor, $this->administration->isGrantedToCaller())) {
            throw RuleProposalRefused::notTheRequester($request->id);
        }

        $this->checks->check($command->proposed->rule, $request->hold_reason->needsReader());

        $proposal = $this->proposals->open(
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
