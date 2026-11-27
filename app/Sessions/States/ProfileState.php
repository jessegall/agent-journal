<?php

declare(strict_types=1);

namespace App\Sessions\States;

use App\Agents\Enums\StopPreparationStatus;
use App\Contracts\Events\Event;
use App\Events\Hooks\StopCheckHeld;
use App\Models\Sessions\SessionRequest;
use App\Models\Sessions\StopCheck;
use App\Processes\Contracts\StopEvidence;
use App\Processes\Contracts\StopPreparer;
use App\Processes\Values\StopPreparation;
use App\Processes\Values\StopPreparationRequest;
use App\Sessions\Commands\CertifyStopCheck\CertifyStopCheckCommand;
use App\Sessions\Commands\HoldStopCheck\HoldStopCheckCommand;
use App\Sessions\Commands\OpenStopCheck\OpenStopCheckCommand;
use App\Sessions\Contracts\SessionPolicyReader;
use App\Sessions\Enums\StopCheckStatus;
use App\Sessions\States\Support\ProfileStateReference;
use App\Sessions\States\Values\UnchangedFailures;
use App\Sessions\Values\StartPolicy;
use App\Stacks\AgentState;
use App\Stacks\Attributes\StateType;
use App\Stacks\Contracts\Work\BaseState;
use App\Stacks\Decisions\MessageLine;
use App\Support\Command;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\Values\HookIdentity;
use App\Values\AgentText;
use App\Values\StackTarget;
use App\Values\WorkReference;
use Generator;

/**
 * The session's profile, for the whole life of the session: a stop runs the profile's stop script and then its final
 * stop conditions, and is refused while they fail. A run of the same failure, unchanged, holds the work instead and
 * tells its owner. A session with no profile, or none frozen, stops freely.
 */
#[StateType(ProfileStateReference::class, schemaVersion: 1)]
final class ProfileState extends AgentState implements BaseState
{
    /**
     * How many failed stops in a row, with the same failures and no change between them, hold the work.
     */
    public const int UNCHANGED_FAILURE_LIMIT = 3;

    /**
     * The work of a session no one started for other work: its own.
     */
    private const string OWN_WORK = 'own-work';

    private UnchangedFailures $unchangedFailures;

    public function __construct(
        private readonly SessionPolicyReader $policies,
        private readonly StopEvidence $evidence,
        private readonly StopPreparer $preparer,
        private readonly string $agentId,
        private readonly string $sessionId,
    ) {
        $this->unchangedFailures = UnchangedFailures::from([]);
    }

    // ----------[ Hooks ]----------

    /**
     * A delegate lets the agent stop, a message line lets it stop with that line, a deny refuses the stop; the stop's
     * attempt is opened, held or certified by the commands it answers with.
     *
     * @return Generator<int, Decision|MessageLine|Command<mixed>|Event>
     */
    public function onStop(StopRequested $input): Generator
    {
        if (! $this->policies->isFrozenFor($this->sessionId)) {
            return;
        }

        $policy = $this->policies->policyFor($this->sessionId);
        $preparation = $this->prepare($input->hook, $policy);
        $stopId = $input->hook->hookId;

        if ($preparation->status === StopPreparationStatus::Preparing) {
            yield new MessageLine($preparation->message);
        }

        if ($preparation->status === StopPreparationStatus::ReturnToActor) {
            yield Decision::deny($preparation->message);
        }

        if ($preparation->status === StopPreparationStatus::Held && $preparation->tellsOwner) {
            yield new HoldStopCheckCommand($this->agentId, $this->sessionId, $stopId, $preparation->message->key);
        }

        if ($preparation->status === StopPreparationStatus::Held) {
            yield new MessageLine($preparation->message);
        }

        if ($preparation->status === StopPreparationStatus::FinalChecks) {
            foreach ($this->finalChecks($input->hook, $policy) as $answer) {
                yield $answer;
            }
        }
    }

    // ----------[ Internals ]----------

    /**
     * Prepares the stop by the session's profile revision; a session started without a profile needs none.
     */
    private function prepare(HookIdentity $stop, StartPolicy $policy): StopPreparation
    {
        if ($policy->profileKey === null || $policy->profileRevision === null) {
            return StopPreparation::finalChecks();
        }

        $work = SessionRequest::findOwnerStartOf($this->sessionId)
            ->map(fn (SessionRequest $start) => WorkReference::forRecord($start->owner_work))
            ->getOrElse(WorkReference::free(self::OWN_WORK));

        return $this->preparer->prepare(new StopPreparationRequest(
            new StackTarget($this->agentId, $this->sessionId)->actorReference(),
            $work,
            $policy->profileKey,
            $policy->profileRevision,
            $policy->access,
            $stop->hookId,
        ));
    }

    /**
     * The answers of the stop's final checks: its attempt is opened on its first call, and a retried stop reads what
     * the checks found.
     *
     * @return list<Decision|MessageLine|Command<mixed>|Event>
     */
    private function finalChecks(HookIdentity $stop, StartPolicy $policy): array
    {
        $open = new OpenStopCheckCommand($this->agentId, $this->sessionId, $stop->hookId);

        if ($policy->stopConditions->isEmpty()) {
            return [$open];
        }

        return StopCheck::findOpenedFor($stop)
            ->map(fn (StopCheck $attempt) => $this->checkedAnswers($attempt, $stop))
            ->getOrElse([$open, new MessageLine(AgentText::of('core.stop.checks_running'))]);
    }

    /**
     * The answers to what the checks of the stop's opened attempt found so far.
     *
     * @return list<Decision|MessageLine|Command<mixed>|Event>
     */
    private function checkedAnswers(StopCheck $attempt, HookIdentity $stop): array
    {
        $stopOutcome = $this->evidence->result($attempt->reference);

        return match ($stopOutcome->status) {
            StopCheckStatus::Pending => [new MessageLine(AgentText::of('core.stop.checks_running'))],
            StopCheckStatus::Passed => [
                $this->passed(),
                new CertifyStopCheckCommand($this->agentId, $this->sessionId, $stop->hookId),
            ],
            StopCheckStatus::Failed => $this->refuseOrHold($attempt, $stopOutcome->failureSummary()),
            StopCheckStatus::Unresolved => [Decision::deny(AgentText::of('core.stop.checks_unresolved'))],
        };
    }

    /**
     * A passed stop starts the count of unchanged failures again.
     */
    private function passed(): Decision
    {
        $this->unchangedFailures->passStop();

        return Decision::delegate();
    }

    /**
     * Refuses a failed stop, or holds the work once this failure is the last of a run of unchanged failures and tells
     * its owner the first time.
     *
     * @return list<Decision|MessageLine|Event>
     */
    private function refuseOrHold(StopCheck $attempt, string $failureSummary): array
    {
        $failure = $attempt->outcomeOf($failureSummary);

        $this->unchangedFailures->failAttempt($attempt->id, $failure);

        if ($this->unchangedFailures->count < self::UNCHANGED_FAILURE_LIMIT) {
            return [Decision::deny(AgentText::of('core.stop.refused', ['conditions' => $failureSummary]))];
        }

        $held = new MessageLine(AgentText::of('core.stop.held', ['conditions' => $failureSummary]));

        if ($this->unchangedFailures->count > self::UNCHANGED_FAILURE_LIMIT) {
            return [$held];
        }

        return [
            $held,
            ...SessionRequest::findOwnerStartOf($this->sessionId)
                ->map(fn (SessionRequest $start) => [new StopCheckHeld($start->owner_work, $attempt->reference)])
                ->getOrElse([]),
        ];
    }
}
