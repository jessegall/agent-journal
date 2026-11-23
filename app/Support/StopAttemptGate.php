<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Processes\StopEvidence;
use App\Contracts\Processes\StopPreparer;
use App\Contracts\Sessions\SessionPolicyReader;
use App\Enums\StopAttemptState;
use App\Enums\StopPreparationState;
use App\Events\HelperStopHeld;
use App\Models\StartRecord;
use App\Models\StopAttempt;
use App\Support\Decisions\Decision;
use App\Support\Decisions\MessageLine;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\States\Contracts\StopConditionGate;
use App\Values\StackTarget;
use App\Values\StartPolicy;
use App\Values\StopPreparation;
use App\Values\StopPreparationRequest;
use App\Values\WorkReference;

/**
 * Opens the stop attempt of a session started under a frozen policy, once per stop callback, and answers by the
 * host's results: still running ends the turn with the job left open, passed allows the stop and certifies the work
 * complete, failed or unresolved refuses it with what the conditions said, and the third unchanged failure in a row
 * ends the turn with the work held for repair. A session without conditions finishes on its stack checks alone. A
 * profile's stop is prepared first, by its STOP script: until it is ready for the final checks no attempt opens.
 */
final readonly class StopAttemptGate implements StopConditionGate
{
    public const string CHECKS_RUNNING = 'Final checks are running: the job stays open until the host reports them.';

    public const string CHECKS_UNRESOLVED = 'The final checks proved neither a pass nor a failure; request the stop again.';

    public const string STOP_HELD = 'The final checks failed three times in a row with the same failures, so the job '
        .'is held for repair and your parent is told.';

    /**
     * How many failed attempts in a row, with the same failures and no change between them, hold the work.
     */
    public const int UNCHANGED_FAILURES_TO_HOLD = 3;

    /**
     * The work of a session no one started for other work: its own.
     */
    private const string OWN_WORK = 'own-work';

    private const string NO_CONDITIONS_SUBMISSION = 'no-conditions';

    private const string PREPARATION_HELD_SUBMISSION = 'preparation-held';

    public function __construct(
        private SessionPolicyReader $policies,
        private StopEvidence $evidence,
        private StopPreparer $preparer,
        private StopCertification $certification,
        private CommandFacts $facts,
    ) {}

    /**
     * The stop's answer: nothing lets it stop, a message line lets it stop with that message, a decision refuses it.
     */
    public function answer(HookIdentity $stop): Decision|MessageLine|null
    {
        if (! $this->policies->isFrozenFor($stop->sessionId)) {
            return null;
        }

        $policy = $this->policies->policyFor($stop->sessionId);
        $preparation = $this->prepare($stop, $policy);

        return match ($preparation->state) {
            StopPreparationState::Preparing => new MessageLine($preparation->message),
            StopPreparationState::ReturnToActor => Decision::deny($preparation->message),
            StopPreparationState::Held => $this->holdPrepared($stop, $policy, $preparation),
            StopPreparationState::FinalChecks => $this->runFinalChecks($stop, $policy),
        };
    }

    /**
     * Prepares the stop by the session's profile revision; a session started without a profile needs none.
     */
    private function prepare(HookIdentity $stop, StartPolicy $policy): StopPreparation
    {
        if ($policy->profileKey === null || $policy->profileRevision === null) {
            return StopPreparation::finalChecks();
        }

        $work = StartRecord::ownerStartOf($stop->sessionId)
            ->map(fn (StartRecord $start) => WorkReference::forRecord($start->ownerWork()))
            ->getOrElse(WorkReference::free(self::OWN_WORK));

        return $this->preparer->prepare(new StopPreparationRequest(
            new StackTarget($stop->agentId, $stop->sessionId)->actorIdentity(),
            $work,
            $policy->profileKey,
            $policy->profileRevision,
            $policy->access,
            $stop->hookId,
        ));
    }

    /**
     * Ends the turn with the work held; the first time it is held, the stop is recorded as failed and the owner told.
     */
    private function holdPrepared(HookIdentity $stop, StartPolicy $policy, StopPreparation $preparation): MessageLine
    {
        if ($preparation->tellsOwner) {
            $attempt = $this->openAttempt($stop, $policy);
            $attempt->settle(StopAttemptState::Failed, self::PREPARATION_HELD_SUBMISSION);
            $this->tellOwnerHeld($attempt);
        }

        return new MessageLine($preparation->message);
    }

    private function runFinalChecks(HookIdentity $stop, StartPolicy $policy): Decision|MessageLine|null
    {
        $attempt = $this->openAttempt($stop, $policy);

        if ($policy->stopConditions->isEmpty()) {
            return $this->passWithoutConditions($attempt);
        }

        $stopOutcome = $this->evidence->result($attempt->reference());

        return match ($stopOutcome->state) {
            StopAttemptState::Pending => new MessageLine(self::CHECKS_RUNNING),
            StopAttemptState::Passed => $this->certifyCompletion($attempt),
            StopAttemptState::Failed => $this->refuseOrHold($attempt, $stop, $stopOutcome->failureSummary()),
            StopAttemptState::Unresolved => Decision::deny(self::CHECKS_UNRESOLVED),
        };
    }

    private function openAttempt(HookIdentity $stop, StartPolicy $policy): StopAttempt
    {
        return StopAttempt::openFor(
            $stop,
            $policy->digest(),
            StopAttempt::FIRST_GENERATION,
            $policy->stopConditions->definitionHashes(),
        );
    }

    /**
     * A stop with no conditions passes with nothing said: a line here would be kept for the agent and wake it only to
     * read that it may stop, and its next stop would do so again without end.
     */
    private function passWithoutConditions(StopAttempt $attempt): null
    {
        if (! $attempt->isSettled()) {
            $attempt->settle(StopAttemptState::Passed, self::NO_CONDITIONS_SUBMISSION);
        }

        return $this->certifyCompletion($attempt);
    }

    private function certifyCompletion(StopAttempt $attempt): null
    {
        $this->certification->certify($attempt);

        return null;
    }

    private function refuseOrHold(
        StopAttempt $attempt,
        HookIdentity $stop,
        string $failureSummary,
    ): Decision|MessageLine {
        $unchangedFailures = $this->unchangedFailureCount($stop->sessionId, $attempt, $failureSummary);

        if ($unchangedFailures < self::UNCHANGED_FAILURES_TO_HOLD) {
            return Decision::deny($failureSummary);
        }

        if ($unchangedFailures === self::UNCHANGED_FAILURES_TO_HOLD) {
            $this->tellOwnerHeld($attempt);
        }

        return new MessageLine(self::STOP_HELD.PHP_EOL.$failureSummary);
    }

    private function tellOwnerHeld(StopAttempt $attempt): void
    {
        StartRecord::ownerStartOf($attempt->session_id)->forAll(
            fn (StartRecord $start) => $this->facts->publishAfterCommit(
                new HelperStopHeld($start->ownerWork(), $attempt->reference()),
            ),
        );
    }

    /**
     * How many of the session's latest settled attempts, this one first, failed in a row with the same failures under
     * the same policy and workspace generation.
     */
    private function unchangedFailureCount(string $sessionId, StopAttempt $attempt, string $summary): int
    {
        $unchangedFailures = 0;

        foreach (StopAttempt::latestSettledOf($sessionId, self::UNCHANGED_FAILURES_TO_HOLD + 1) as $settled) {
            $isSameFailure = $settled->state === StopAttemptState::Failed
                && $settled->isFor($attempt->policy_digest, $attempt->workspace_generation)
                && $this->evidence->result($settled->reference())->failureSummary() === $summary;

            if (! $isSameFailure) {
                break;
            }

            $unchangedFailures++;
        }

        return $unchangedFailures;
    }
}
