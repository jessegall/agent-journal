<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Processes\EvidenceRunStarted;
use App\Calls\Processes\StartEvidenceRunCall;
use App\Contracts\Actors\CurrentActor;
use App\Models\EvidencePermit;
use App\Support\ActorIdentity;
use App\Support\EvidenceRuns;

/**
 * Starts the evidence run a permit allows under the call's request key and answers its run.
 */
final readonly class StartEvidenceRunController
{
    public function __invoke(
        StartEvidenceRunCall $call,
        EvidencePermit $evidencePermit,
        CurrentActor $actors,
        EvidenceRuns $evidence,
    ): EvidenceRunStarted {
        $run = $evidence->start($evidencePermit, ActorIdentity::of($actors->actor()), $call->requestKey->value);

        return EvidenceRunStarted::from(['runId' => $run->id]);
    }
}
