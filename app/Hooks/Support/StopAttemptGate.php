<?php

declare(strict_types=1);

namespace App\Hooks\Support;

use App\Agents\Contracts\SessionPolicyReader;
use App\Agents\Models\CertifiedWork;
use App\Agents\Models\StartRecord;
use App\Hooks\Contracts\StopConditionGate;
use App\Hooks\Contracts\StopEvidence;
use App\Hooks\Decisions\Decision;
use App\Hooks\Enums\StopAttemptState;
use App\Hooks\Events\HelperCompletionCertified;
use App\Hooks\Events\HelperStopHeld;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Models\StopAttempt;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Opens the stop attempt of a session started under a frozen policy, once per stop callback, and answers by the
 * host's results: still running ends the turn with the job left open, passed allows the stop and certifies the work
 * complete, failed or unresolved refuses it with what the conditions said, and the third unchanged failure in a row
 * ends the turn with the work held for repair. A session without conditions finishes on its stack checks alone.
 */
final readonly class StopAttemptGate implements StopConditionGate
{
    public const string CHECKS_RUNNING = 'Final checks are running: the job stays open until the host reports them.';

    public const string CHECKS_UNRESOLVED = 'The final checks proved neither a pass nor a failure; request the stop again.';

    public const string NO_CHECKS_REQUIRED = 'No final checks were required: the stop passed on its stack checks.';

    public const string STOP_HELD = 'The final checks failed three times in a row with the same failures, so the job '
        .'is held for repair and your parent is told.';

    /**
     * How many failed attempts in a row, with the same failures and no change between them, hold the work.
     */
    public const int UNCHANGED_FAILURES_TO_HOLD = 3;

    private const string NO_CONDITIONS_SUBMISSION = 'no-conditions';

    public function __construct(
        private SessionPolicyReader $policies,
        private StopEvidence $evidence,
        private Dispatcher $events,
    ) {}

    public function answer(HookIdentity $stop): Decision
    {
        if (! $this->policies->isFrozenFor($stop->sessionId)) {
            return Decision::allow();
        }

        $policy = $this->policies->policyFor($stop->sessionId);
        $attempt = StopAttempt::openFor(
            $stop,
            $policy->digest(),
            StopAttempt::FIRST_GENERATION,
            $policy->stopConditions->definitionHashes(),
        );

        if ($policy->stopConditions->isEmpty()) {
            return $this->passWithoutConditions($attempt);
        }

        $stopOutcome = $this->evidence->result($attempt->reference());

        return match ($stopOutcome->state) {
            StopAttemptState::Pending => Decision::allow()->withMessage(self::CHECKS_RUNNING),
            StopAttemptState::Passed => $this->certifyCompletion($attempt, Decision::allow()),
            StopAttemptState::Failed => $this->refuseOrHold($attempt, $stop, $stopOutcome->failureSummary()),
            StopAttemptState::Unresolved => Decision::deny(self::CHECKS_UNRESOLVED),
        };
    }

    private function passWithoutConditions(StopAttempt $attempt): Decision
    {
        if (! $attempt->isSettled()) {
            $attempt->settle(StopAttemptState::Passed, self::NO_CONDITIONS_SUBMISSION);
        }

        return $this->certifyCompletion($attempt, Decision::allow()->withMessage(self::NO_CHECKS_REQUIRED));
    }

    /**
     * Certifies the work of the session complete by this passed attempt, once, and answers with the decision.
     */
    private function certifyCompletion(StopAttempt $attempt, Decision $decision): Decision
    {
        if ($attempt->isCertified()) {
            return $decision;
        }

        $attempt->certify();

        StartRecord::ownerStartOf($attempt->session_id)->forAll(function (StartRecord $start) use ($attempt): void {
            CertifiedWork::record($start, $attempt->id);
            $this->events->dispatch(new HelperCompletionCertified($start->ownerWork(), $attempt->reference()));
        });

        return $decision;
    }

    private function refuseOrHold(StopAttempt $attempt, HookIdentity $stop, string $failureSummary): Decision
    {
        $unchangedFailures = $this->unchangedFailureCount($stop->sessionId, $attempt, $failureSummary);

        if ($unchangedFailures < self::UNCHANGED_FAILURES_TO_HOLD) {
            return Decision::deny($failureSummary);
        }

        if ($unchangedFailures === self::UNCHANGED_FAILURES_TO_HOLD) {
            StartRecord::ownerStartOf($attempt->session_id)->forAll(
                fn (StartRecord $start) => $this->events->dispatch(
                    new HelperStopHeld($start->ownerWork(), $attempt->reference()),
                ),
            );
        }

        return Decision::allow()->withMessage(self::STOP_HELD.PHP_EOL.$failureSummary);
    }

    /**
     * How many of the session's latest settled attempts, this one first, failed in a row with the same failures under
     * the same policy and workspace generation.
     */
    private function unchangedFailureCount(string $sessionId, StopAttempt $attempt, string $failureSummary): int
    {
        $unchangedFailures = 0;

        foreach (StopAttempt::latestSettledOf($sessionId, self::UNCHANGED_FAILURES_TO_HOLD + 1) as $settled) {
            $isSameFailure = $settled->state === StopAttemptState::Failed
                && $settled->isFor($attempt->policy_digest, $attempt->workspace_generation)
                && $this->evidence->result($settled->reference())->failureSummary() === $failureSummary;

            if (! $isSameFailure) {
                break;
            }

            $unchangedFailures++;
        }

        return $unchangedFailures;
    }
}
