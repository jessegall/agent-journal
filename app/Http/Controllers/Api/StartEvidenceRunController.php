<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\EvidenceRunStarted;
use App\Api\Processes\StartEvidenceRunPayload;
use App\Contracts\Actors\CurrentActor;
use App\Models\CommandRules\EvidencePermit;
use App\Support\ActorIdentity;
use App\Support\EvidenceRuns;

/**
 * Starts the evidence run a permit allows under the call's request key and answers its run.
 */
final readonly class StartEvidenceRunController
{
    public function __invoke(
        StartEvidenceRunPayload $call,
        EvidencePermit $evidencePermit,
        CurrentActor $actors,
        EvidenceRuns $evidence,
    ): EvidenceRunStarted {
        $run = $evidence->start($evidencePermit, ActorIdentity::of($actors->actor()), $call->requestKey->value);

        return EvidenceRunStarted::from(['runId' => $run->id]);
    }
}
