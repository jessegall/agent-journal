<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Sessions\SessionPolicyReader;
use App\Events\Hooks\HelperCompletionCertified;
use App\Models\Reviews\CertifiedWork;
use App\Models\Reviews\WorkReservation;
use App\Models\Sessions\SessionRequest;
use App\Models\Sessions\StopCheck;
use App\Values\StartPolicy;

/**
 * Certifies the work of a session complete by a stop attempt whose final checks passed, once: the certificate is
 * recorded for the start that owns the work, work that must be reviewed reserves its actor and checkout before
 * anyone hears of it, and then the owner hears of it.
 */
final readonly class StopCertification
{
    public function __construct(private SessionPolicyReader $policies, private CommandFacts $facts) {}

    public function certify(StopCheck $attempt): void
    {
        if ($attempt->isCertified()) {
            return;
        }

        $attempt->certify();
        $policy = $this->policies->policyFor($attempt->session_id);

        SessionRequest::ownerStartOf($attempt->session_id)->forAll(
            fn (SessionRequest $start) => $this->certifyFor($start, $attempt, $policy),
        );
    }

    private function certifyFor(SessionRequest $start, StopCheck $attempt, StartPolicy $policy): void
    {
        $work = CertifiedWork::create($start, $attempt->id);

        if ($policy->requiresReview) {
            WorkReservation::retain($work, StopCheck::agentOf($attempt->reference), $attempt->workspace_generation);
        }

        $this->facts->publishAfterCommit(new HelperCompletionCertified($start->owner_work, $attempt->reference));
    }
}
