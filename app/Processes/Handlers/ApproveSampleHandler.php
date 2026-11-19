<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Contracts\CommandHandler;
use App\Processes\Commands\ApproveSample;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Exceptions\EvidencePermitRefused;
use App\Processes\Exceptions\RequestTransitionRefused;
use App\Processes\Exceptions\SampleRefused;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\RuleProposal;
use App\Processes\Models\RuleProposalRevision;
use App\Processes\Policies\ProcessAdministrationPolicy;
use App\Processes\Support\EvidenceRuns;

/**
 * Issues the one-use permit for the request's exact line, classified with the declaration revision the owner reviewed;
 * a line that stays unknown or needs more than the runner's role is refused, as is a declaration without effects.
 */
final readonly class ApproveSampleHandler implements CommandHandler
{
    public function __construct(private CurrentAuthorizer $administration, private EvidenceRuns $evidence) {}

    /**
     * @throws SampleRefused
     * @throws EvidencePermitRefused
     * @throws RequestTransitionRefused
     */
    public function handle(ApproveSample $command): string
    {
        $this->administration->authorize(ProcessAdministrationPolicy::class, CommandRequest::class, ProcessAbility::Administer);
        $request = CommandRequest::query()->whereKey($command->commandRequestId)->lockForUpdate()->sole();
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
