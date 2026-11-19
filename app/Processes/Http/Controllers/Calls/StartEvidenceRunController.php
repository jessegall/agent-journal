<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Processes\Calls\EvidenceRunStarted;
use App\Processes\Calls\StartEvidenceRunCall;
use App\Processes\Models\EvidencePermit;
use App\Processes\Support\EvidenceRuns;

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
