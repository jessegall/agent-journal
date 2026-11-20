<?php

declare(strict_types=1);

namespace App\Hooks\Support;

use App\Agents\Contracts\SessionPolicyReader;
use App\Agents\Models\CertifiedWork;
use App\Agents\Models\StartRecord;
use App\Agents\Models\WorkReservation;
use App\Agents\Support\StartPolicy;
use App\Agents\Values\WorkReference;
use App\Hooks\Events\HelperCompletionCertified;
use App\Hooks\Models\StopAttempt;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Certifies the work of a session complete by a stop attempt whose final checks passed, once: the certificate is
 * recorded for the start that owns the work, work that must be reviewed reserves its actor and checkout before
 * anyone hears of it, and then the owner hears of it.
 */
final readonly class StopCertification
{
    public function __construct(private SessionPolicyReader $policies, private Dispatcher $events) {}

    public function certify(StopAttempt $attempt): void
    {
        if ($attempt->isCertified()) {
            return;
        }

        $attempt->certify();
        $policy = $this->policies->policyFor($attempt->session_id);

        StartRecord::ownerStartOf($attempt->session_id)->forAll(
            fn (StartRecord $start) => $this->certifyFor($start, $attempt, $policy),
        );
    }

    private function certifyFor(StartRecord $start, StopAttempt $attempt, StartPolicy $policy): void
    {
        CertifiedWork::record($start, $attempt->id);

        if ($policy->requiresReview) {
            WorkReservation::retain(
                StopAttempt::agentOf($attempt->reference()),
                $policy->execution->worktree,
                WorkReference::forRecord($start->ownerWork()),
                $attempt->workspace_generation,
                $attempt->id,
            );
        }

        $this->events->dispatch(new HelperCompletionCertified($start->ownerWork(), $attempt->reference()));
    }
}
