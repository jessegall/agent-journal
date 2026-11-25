<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\ApproveSample;

use App\Contracts\Bus\CommandHandler;
use App\Exceptions\EvidencePermitRefused;
use App\Exceptions\RequestTransitionRefused;
use App\Exceptions\SampleRefused;
use App\Models\CommandRules\CommandRequest;
use App\Models\CommandRules\RuleProposal;
use App\Models\CommandRules\RuleProposalRevision;
use App\Support\EvidenceRuns;

/**
 * Issues the one-use permit for the request's exact line, classified with the declaration revision the owner reviewed;
 * a line that stays unknown or needs more than the runner's role is refused, as is a declaration without effects.
 */
final readonly class ApproveSampleHandler implements CommandHandler
{
    public function __construct(private EvidenceRuns $evidence) {}

    /**
     * @throws SampleRefused
     * @throws EvidencePermitRefused
     * @throws RequestTransitionRefused
     */
    public function handle(ApproveSampleCommand $command): string
    {
        $request = CommandRequest::findLockedForChange($command->commandRequestId);

        if ($command->commandDigest !== $request->source_digest) {
            throw SampleRefused::otherCommand($request->id);
        }

        $declaration = RuleProposalRevision::query()->answering($request, $command->expectedRevision)->first();

        if ($declaration === null) {
            throw SampleRefused::declarationMissing($request->id, $command->expectedRevision);
        }

        $proposal = RuleProposal::query()->whereKey($declaration->rule_proposal_id)->sole();

        if ($proposal->current_revision !== $command->expectedRevision) {
            throw SampleRefused::stale($request->id, $command->expectedRevision, $proposal->current_revision);
        }

        if ($declaration->payload->classes->isEmpty()) {
            throw SampleRefused::effectsUnknown($request->id);
        }

        $permit = $this->evidence->issueForRequest($request, $declaration->payload);
        $request->approveSample();

        return $permit->id;
    }
}
