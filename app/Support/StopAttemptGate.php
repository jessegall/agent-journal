<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Processes\StopEvidence;
use App\Contracts\Processes\StopPreparer;
use App\Contracts\Sessions\SessionPolicyReader;
use App\Enums\StopAttemptState;
use App\Enums\StopPreparationState;
use App\Events\Hooks\HelperStopHeld;
use App\Models\Starts\StartRecord;
use App\Models\Starts\StopAttempt;
use App\Support\Decisions\Decision;
use App\Support\Decisions\MessageLine;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\States\Contracts\StopConditionGate;
use App\Values\AgentText;
use App\Values\SettledStopAttempts;
use App\Values\StackTarget;
use App\Values\StartPolicy;
use App\Values\StopAnswer;
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
     * The stop's answer: a delegate lets it stop, a message line lets it stop with that message, a deny refuses it.
     */
    public function answer(HookIdentity $stop, SettledStopAttempts $settled): StopAnswer
    {
        if (! $this->policies->isFrozenFor($stop->sessionId)) {
            return StopAnswer::withoutAttempt(Decision::delegate());
        }

        $policy = $this->policies->policyFor($stop->sessionId);
        $preparation = $this->prepare($stop, $policy);

        return match ($preparation->state) {
            StopPreparationState::Preparing => StopAnswer::withoutAttempt(new MessageLine($preparation->message)),
            StopPreparationState::ReturnToActor => StopAnswer::withoutAttempt(Decision::deny($preparation->message)),
            StopPreparationState::Held => $this->holdPrepared($stop, $policy, $preparation),
            StopPreparationState::FinalChecks => $this->runFinalChecks($stop, $policy, $settled),
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
            ->map(fn (StartRecord $start) => WorkReference::forRecord($start->ownerWork))
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
    private function holdPrepared(HookIdentity $stop, StartPolicy $policy, StopPreparation $preparation): StopAnswer
    {
        $held = new MessageLine($preparation->message);

        if (! $preparation->tellsOwner) {
            return StopAnswer::withoutAttempt($held);
        }

        $attempt = $this->openAttempt($stop, $policy);
        $attempt->settle(StopAttemptState::Failed, self::PREPARATION_HELD_SUBMISSION, $preparation->message->key);
        $this->tellOwnerHeld($attempt);

        return StopAnswer::forAttempt($attempt->id, $held);
    }

    private function runFinalChecks(HookIdentity $stop, StartPolicy $policy, SettledStopAttempts $settled): StopAnswer
    {
        $attempt = $this->openAttempt($stop, $policy);

        if ($policy->stopConditions->isEmpty()) {
            return StopAnswer::forAttempt($attempt->id, $this->passWithoutConditions($attempt));
        }

        $stopOutcome = $this->evidence->result($attempt->reference);

        return StopAnswer::forAttempt($attempt->id, match ($stopOutcome->state) {
            StopAttemptState::Pending => new MessageLine(AgentText::of('core.stop.checks_running')),
            StopAttemptState::Passed => $this->certifyCompletion($attempt),
            StopAttemptState::Failed => $this->refuseOrHold($attempt, $settled, $stopOutcome->failureSummary()),
            StopAttemptState::Unresolved => Decision::deny(AgentText::of('core.stop.checks_unresolved')),
        });
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
    private function passWithoutConditions(StopAttempt $attempt): Decision
    {
        if (! $attempt->isSettled()) {
            $attempt->settle(StopAttemptState::Passed, self::NO_CONDITIONS_SUBMISSION, '');
        }

        return $this->certifyCompletion($attempt);
    }

    private function certifyCompletion(StopAttempt $attempt): Decision
    {
        $this->certification->certify($attempt);

        return Decision::delegate();
    }

    /**
     * Refuses a failed stop, or holds the work once this failure is the last of a run of unchanged failures, counted
     * from the attempts the stack saw settle before this one.
     */
    private function refuseOrHold(
        StopAttempt $attempt,
        SettledStopAttempts $settled,
        string $failureSummary,
    ): Decision|MessageLine {
        $unchangedFailures = $settled->unchangedBefore($attempt->id, $attempt->outcomeOf($failureSummary)) + 1;

        if ($unchangedFailures < self::UNCHANGED_FAILURE_LIMIT) {
            return Decision::deny(AgentText::of('core.stop.refused', ['conditions' => $failureSummary]));
        }

        if ($unchangedFailures === self::UNCHANGED_FAILURE_LIMIT) {
            $this->tellOwnerHeld($attempt);
        }

        return new MessageLine(AgentText::of('core.stop.held', ['conditions' => $failureSummary]));
    }

    private function tellOwnerHeld(StopAttempt $attempt): void
    {
        StartRecord::ownerStartOf($attempt->session_id)->forAll(
            fn (StartRecord $start) => $this->facts->publishAfterCommit(
                new HelperStopHeld($start->ownerWork, $attempt->reference),
            ),
        );
    }
}
