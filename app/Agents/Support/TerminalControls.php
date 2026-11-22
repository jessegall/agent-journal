<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Support\ActorIdentity;
use App\Agents\Data\TerminalControlData;
use App\Agents\Enums\DriverOperation;
use App\Agents\Enums\TerminalDraftChoice;
use App\Agents\Enums\TerminalInputKind;
use App\Agents\Enums\TerminalReceiptOutcome;
use App\Agents\Exceptions\TerminalControlRefused;
use App\Agents\Exceptions\TerminalViewRefused;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\DriverRequest;
use App\Agents\Models\Host;
use App\Agents\Models\TerminalGrant;
use App\Agents\Models\TerminalView;
use App\Agents\Policies\AgentTerminalControlPolicy;
use App\Agents\Values\DriverRequestPayload;
use App\Agents\Values\PrivateSubmission;
use App\Agents\Values\StackTarget;
use App\Operations\Enums\AccessType;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;

/**
 * A browser writer's control of an agent's terminal: takes, renewals, releases and every input, each one a host
 * request the host carries out through its input gate. Control is the owner's alone and is checked again on every
 * renewal and input; a grant whose access, session or lifetime ended is retired and fenced at the host.
 */
final readonly class TerminalControls
{
    public function __construct(
        private CurrentAuthorizer $authorizer,
        private CurrentRuntimes $runtimes,
        private DriverRequests $requests,
    ) {}

    /**
     * Takes the runtime's input for the writer through their live read interest. Two takes racing for one runtime
     * leave one holder; a retried take gives its first answer.
     *
     * @throws TerminalControlRefused
     * @throws TerminalViewRefused
     */
    public function take(
        string $agentId,
        ActorIdentity $writer,
        string $readInterestId,
        string $takeId,
        CarbonImmutable $now,
    ): TerminalControlData {
        $this->assertMayControl();
        $runtime = $this->lockedRuntime($agentId);
        $taken = TerminalGrant::query()->ownedBy($writer)->ofTake($takeId)->first();

        if ($taken !== null) {
            return $this->answerOf($taken, $now);
        }

        $interest = TerminalView::query()->ownedBy($writer)->live()->withReadInterest($readInterestId)
            ->where('agent_runtime_id', $runtime->id)->first();

        if ($interest === null || $interest->hasEndedAt($now)) {
            throw TerminalViewRefused::unknownInterest();
        }

        if (! Host::query()->whereKey($runtime->host_id)->sole()->carriesOutBrowserInput()) {
            throw TerminalControlRefused::watchOnly();
        }

        if (TerminalGrant::query()->acrossActors()->holdingRuntime($runtime->id, $now)->exists()) {
            throw TerminalControlRefused::controlHeld();
        }

        $grant = TerminalGrant::take($writer, $runtime->load('session'), $interest, $takeId, $now);
        $request = $this->send($runtime, DriverOperation::TakeControl, "take:{$takeId}", [
            'take_id' => $takeId,
            'generation' => $runtime->process_generation,
        ]);
        $grant->sendTakeWith($request);

        return $this->answerOf($grant, $now);
    }

    /**
     * Cancels the writer's take: a take still on its way never issues a grant, and a grant it issued is released.
     *
     * @throws TerminalControlRefused
     * @throws TerminalViewRefused
     */
    public function cancel(
        string $agentId,
        ActorIdentity $writer,
        string $takeId,
        CarbonImmutable $now,
    ): TerminalControlData {
        $runtime = $this->lockedRuntime($agentId);
        $grant = $this->takeOf($writer, $takeId);

        if ($grant->state->isHolding()) {
            $grant->release($this->send($runtime, DriverOperation::CancelTake, "cancel:{$takeId}", [
                'take_id' => $takeId,
            ]));
        }

        return $this->answerOf($grant, $now);
    }

    /**
     * @throws TerminalControlRefused
     * @throws TerminalViewRefused
     */
    public function renew(
        string $agentId,
        ActorIdentity $writer,
        string $grantId,
        CarbonImmutable $now,
    ): TerminalControlData {
        [$runtime, $grant] = $this->writingGrant($agentId, $writer, $grantId, $now);
        $grant->renew($now);
        $this->send($runtime, DriverOperation::TakeControl, 'renew:'.Str::ulid(), [
            'take_id' => $grant->take_id,
            'grant_id' => $grantId,
            'renew' => true,
        ]);

        return $this->answerOf($grant, $now);
    }

    /**
     * Gives the input back; the answer stays releasing until the host fenced the grant.
     *
     * @throws TerminalControlRefused
     * @throws TerminalViewRefused
     */
    public function release(
        string $agentId,
        ActorIdentity $writer,
        string $grantId,
        CarbonImmutable $now,
    ): TerminalControlData {
        $runtime = $this->lockedRuntime($agentId);
        $grant = $this->grantOf($writer, $grantId);

        if ($grant->state->isHolding()) {
            $grant->release($this->send($runtime, DriverOperation::ReleaseControl, "release:{$grantId}", [
                'take_id' => $grant->take_id,
                'grant_id' => $grantId,
            ]));
        }

        return $this->answerOf($grant, $now);
    }

    /**
     * Sends text or Enter through the writer's grant, at exactly the next sequence and for the screen revision the
     * writer saw; the host checks the prompt again before it writes.
     *
     * @throws TerminalControlRefused
     * @throws TerminalViewRefused
     */
    public function input(
        string $agentId,
        ActorIdentity $writer,
        string $grantId,
        TerminalInput $input,
        CarbonImmutable $now,
    ): TerminalControlData {
        if ($input->isOverPasteBound()) {
            throw TerminalControlRefused::pasteTooLarge(TerminalInput::PASTE_BYTE_LIMIT);
        }

        [$runtime, $grant] = $this->writingGrant($agentId, $writer, $grantId, $now);
        $this->assertCarriesOut($runtime, $input->kind);
        $this->takeSequence($grant, $input->sequence);
        $this->send($runtime, DriverOperation::TerminalInput, "input:{$grant->grant_id}:{$input->sequence}", [
            'grant_id' => $grant->grant_id,
            'sequence' => $input->sequence,
            'screen_revision' => $input->screenRevision,
            'text' => $input->text,
            'enter' => $input->enter,
            'kind' => $input->kind->value,
            'key' => $input->key?->value,
            'rows' => $input->rows,
            'columns' => $input->columns,
        ]);

        return $this->answerOf($grant, $now);
    }

    /**
     * Carries out the writer's choice for the unsent line, at exactly the next sequence.
     *
     * @throws TerminalControlRefused
     * @throws TerminalViewRefused
     */
    public function choose(
        string $agentId,
        ActorIdentity $writer,
        string $grantId,
        TerminalDraftChoice $choice,
        int $sequence,
        CarbonImmutable $now,
    ): TerminalControlData {
        [$runtime, $grant] = $this->writingGrant($agentId, $writer, $grantId, $now);
        $this->takeSequence($grant, $sequence);
        $this->send($runtime, DriverOperation::DraftChoice, "choose:{$grant->grant_id}:{$sequence}", [
            'grant_id' => $grant->grant_id,
            'sequence' => $sequence,
            'choice' => $choice->value,
        ]);

        return $this->answerOf($grant, $now);
    }

    /**
     * Asks the host to close the capture barrier for a private entry; the field is offered once the host's receipt says
     * every sink confirmed. Only a host that advertises private entry gets the request.
     *
     * @throws TerminalControlRefused
     * @throws TerminalViewRefused
     */
    public function openPrivate(
        string $agentId,
        ActorIdentity $writer,
        string $grantId,
        int $sequence,
        CarbonImmutable $now,
    ): TerminalControlData {
        [$runtime, $grant] = $this->writingGrant($agentId, $writer, $grantId, $now);
        $this->assertCarriesOut($runtime, TerminalInputKind::Private);
        $this->takeSequence($grant, $sequence);
        $this->send($runtime, DriverOperation::OpenPrivateEntry, "input:{$grantId}:{$sequence}", [
            'grant_id' => $grantId,
            'sequence' => $sequence,
        ]);

        return $this->answerOf($grant, $now);
    }

    /**
     * Sends a private value to the host once, under its single-use submission id: the value already waits in the
     * cache (PrivateValues) until the host claims it, and the request row and its receipt name the submission alone.
     *
     * @throws TerminalControlRefused
     * @throws TerminalViewRefused
     */
    public function submitPrivate(
        string $agentId,
        ActorIdentity $writer,
        string $grantId,
        PrivateSubmission $submission,
        CarbonImmutable $now,
    ): TerminalControlData {
        [$runtime, $grant] = $this->writingGrant($agentId, $writer, $grantId, $now);
        $this->assertCarriesOut($runtime, TerminalInputKind::Private);
        $this->takeSequence($grant, $submission->sequence);
        $this->send($runtime, DriverOperation::PrivateInput, "input:{$grantId}:{$submission->sequence}", [
            'grant_id' => $grantId,
            'sequence' => $submission->sequence,
            'submission_id' => $submission->submissionId,
        ]);

        return $this->answerOf($grant, $now);
    }

    /**
     * Leaves private entry without a value; the session stays shielded until the host sees a verified public redraw.
     *
     * @throws TerminalControlRefused
     * @throws TerminalViewRefused
     */
    public function cancelPrivate(
        string $agentId,
        ActorIdentity $writer,
        string $grantId,
        CarbonImmutable $now,
    ): TerminalControlData {
        [$runtime, $grant] = $this->writingGrant($agentId, $writer, $grantId, $now);
        $this->send($runtime, DriverOperation::CancelPrivateEntry, 'private-cancel:'.Str::ulid(), [
            'grant_id' => $grantId,
        ]);

        return $this->answerOf($grant, $now);
    }

    /**
     * Asks the host to look at the screen again, as after an uncertain write; it never writes anything.
     *
     * @throws TerminalControlRefused
     * @throws TerminalViewRefused
     */
    public function check(
        string $agentId,
        ActorIdentity $writer,
        string $grantId,
        CarbonImmutable $now,
    ): TerminalControlData {
        [$runtime, $grant] = $this->writingGrant($agentId, $writer, $grantId, $now);
        $this->send($runtime, DriverOperation::CheckScreen, 'check:'.Str::ulid(), ['grant_id' => $grant->grant_id]);

        return $this->answerOf($grant, $now);
    }

    /**
     * The writer's take as it stands, the grant the host issued once it did, and what became of the input at the
     * sequence when one is asked for.
     *
     * @throws TerminalControlRefused
     */
    public function receipt(
        ActorIdentity $writer,
        string $takeId,
        int $sequence,
        CarbonImmutable $now,
    ): TerminalControlData {
        $this->assertMayControl();
        $grant = $this->takeOf($writer, $takeId);

        if ($sequence === 0 || $grant->grant_id === null) {
            return $this->answerOf($grant, $now);
        }

        $sent = DriverRequest::query()->where('agent_runtime_id', $grant->agent_runtime_id)
            ->where('idempotency_key', "input:{$grant->grant_id}:{$sequence}")->first();
        $outcome = $sent === null
            ? TerminalReceiptOutcome::Unknown
            : TerminalReceiptOutcome::ofProgress($sent->progress);

        return TerminalControlData::from([
            ...$this->fieldsOf($grant, $now),
            'receipt' => ['sequence' => $sequence, 'outcome' => $outcome, 'achievedSize' => $sent?->actual_binding],
        ]);
    }

    /**
     * Retires every grant and pending take of the runtime, whoever holds it, before the runtime is stopped; each is
     * fenced at the host ahead of the stop.
     */
    public function revokeRuntime(AgentRuntime $runtime, CarbonImmutable $now): void
    {
        $grants = TerminalGrant::query()->acrossActors()->holdingRuntime($runtime->id, $now)->get();

        foreach ($grants as $grant) {
            $this->revoke($runtime, $grant);
        }
    }

    /**
     * Retires every grant the viewer holds on the agent, as when they may no longer inspect it, and fences each at
     * its host.
     */
    public function revokeAllFor(string $agentId, ActorIdentity $viewer, CarbonImmutable $now): void
    {
        $grants = TerminalGrant::query()->with('runtime.session')->ownedBy($viewer)->where('agent_id', $agentId)
            ->get()->filter(fn (TerminalGrant $grant): bool => $grant->holdsAt($now));

        foreach ($grants as $grant) {
            $this->revoke($grant->runtime, $grant);
        }
    }

    /**
     * The writer's grant when it may still write: control is checked again, and a grant whose session, generation or
     * lifetime ended is refused; the host's own grant has lapsed by then, so nothing it refuses can still be written.
     *
     * @return array{AgentRuntime, TerminalGrant}
     *
     * @throws TerminalControlRefused
     * @throws TerminalViewRefused
     */
    private function writingGrant(string $agentId, ActorIdentity $writer, string $grantId, CarbonImmutable $now): array
    {
        $this->assertMayControl();
        $runtime = $this->lockedRuntime($agentId);
        $grant = $this->grantOf($writer, $grantId);

        if (! $grant->writesFor($runtime, $now)) {
            throw TerminalControlRefused::grantEnded();
        }

        return [$runtime, $grant];
    }

    /**
     * @throws TerminalControlRefused
     */
    private function grantOf(ActorIdentity $writer, string $grantId): TerminalGrant
    {
        $grant = TerminalGrant::query()->ownedBy($writer)->withGrantId($grantId)->first();

        if ($grant === null) {
            throw TerminalControlRefused::grantEnded();
        }

        return $grant;
    }

    private function revoke(AgentRuntime $runtime, TerminalGrant $grant): void
    {
        if (! $grant->state->isHolding()) {
            return;
        }

        $grant->retire($this->send($runtime, DriverOperation::ReleaseControl, "retire:{$grant->take_id}", [
            'take_id' => $grant->take_id,
            'grant_id' => $grant->grant_id,
        ]));
    }

    /**
     * Refuses a key or a paste for a host that does not carry that kind of input out.
     *
     * @throws TerminalControlRefused
     */
    private function assertCarriesOut(AgentRuntime $runtime, TerminalInputKind $kind): void
    {
        if (! Host::query()->whereKey($runtime->host_id)->sole()->carriesOutBrowserInputOf($kind)) {
            throw TerminalControlRefused::watchOnly();
        }
    }

    /**
     * @throws TerminalControlRefused
     */
    private function takeSequence(TerminalGrant $grant, int $sequence): void
    {
        if ($sequence !== $grant->next_sequence) {
            throw TerminalControlRefused::sequenceGap($grant->next_sequence);
        }

        $grant->takeSequence();
    }

    /**
     * @throws TerminalControlRefused
     */
    private function takeOf(ActorIdentity $writer, string $takeId): TerminalGrant
    {
        $grant = TerminalGrant::query()->ownedBy($writer)->ofTake($takeId)->first();

        if ($grant === null) {
            throw TerminalControlRefused::unknownTake();
        }

        return $grant;
    }

    /**
     * @throws TerminalControlRefused
     */
    private function assertMayControl(): void
    {
        if (! $this->mayControl()) {
            throw TerminalControlRefused::inspectOnly();
        }
    }

    private function mayControl(): bool
    {
        $allowed = [AccessType::Edit];

        return $this->authorizer->filterActions(AgentTerminalControlPolicy::class, Agent::class, $allowed) !== [];
    }

    /**
     * The agent's current runtime, locked, so takes, releases and inputs of one runtime never interleave.
     *
     * @throws TerminalViewRefused
     */
    private function lockedRuntime(string $agentId): AgentRuntime
    {
        $runtime = $this->runtimes->of($agentId);

        return AgentRuntime::query()->with('session')->whereKey($runtime->id)->lockForUpdate()->sole();
    }

    /**
     * Queues the operation for the runtime's host as a control request, which it takes before any turn.
     *
     * @param  array<string, string|int|bool|null>  $fields
     */
    private function send(AgentRuntime $runtime, DriverOperation $operation, string $key, array $fields): DriverRequest
    {
        return $this->requests->append(
            new StackTarget($runtime->session->agent_id, $runtime->agent_session_id),
            $operation,
            $key,
            DriverRequestPayload::terminalControl($fields),
        );
    }

    private function answerOf(TerminalGrant $grant, CarbonImmutable $now): TerminalControlData
    {
        return TerminalControlData::from($this->fieldsOf($grant, $now));
    }

    /**
     * @return array<string, mixed>
     */
    private function fieldsOf(TerminalGrant $grant, CarbonImmutable $now): array
    {
        return [
            'takeId' => $grant->take_id,
            'grantId' => $grant->grant_id,
            'state' => $grant->state,
            'expiresInSeconds' => max(0, (int) $now->diffInSeconds($grant->expires_at, false)),
            'nextSequence' => $grant->next_sequence,
            'privateEntry' => Host::query()->whereKey($grant->host_id)->sole()
                ->carriesOutBrowserInputOf(TerminalInputKind::Private),
        ];
    }
}
