<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Chat\Inbox;
use App\Contracts\Chat\InboxResolver;
use App\Contracts\Sessions\CurrentSession;
use App\Enums\SpeechOpportunityState;
use App\Exceptions\InboxUnavailable;
use App\Exceptions\SpeechRefused;
use App\Models\InboxInterval;
use App\Models\Message;
use App\Models\PresentationBatch;
use App\Models\SpeechOpportunity;
use Carbon\CarbonImmutable;

/**
 * Who may speak in a chat: a user's message gives each agent member one turn, kept for a question the user put to
 * it; an agent claims its turn for two minutes under an opaque token and writes once with it. Users need no claim.
 */
final readonly class SpeechAllowance
{
    public const int LEASE_SECONDS = 120;

    private const int TOKEN_BYTES = 32;

    public function __construct(private InboxResolver $inboxes, private CurrentSession $session) {}

    /**
     * One turn for each agent member present when the user's message was accepted; a question asked of one agent,
     * or of the only agent in the chat, keeps that agent's turn for it.
     *
     * @param  list<InboxInterval>  $intervals
     */
    public function openFor(Message $userMessage, array $intervals): void
    {
        $agents = array_values(array_filter(
            $intervals,
            fn (InboxInterval $interval) => $interval->actor->type->isAgent()
                && $this->isOfferedTo($userMessage, $interval),
        ));

        foreach ($agents as $interval) {
            $opportunity = SpeechOpportunity::create($userMessage, $interval->actor, $interval);

            if ($this->isAskedOf($userMessage, $interval->actor, count($agents))) {
                $opportunity->reserveFor($userMessage);
            }
        }
    }

    /**
     * An agent's post addressed to another agent hands the conversation over: that agent is offered a turn under the
     * same user message once, if it has none yet; one that already spoke there waits for a new user message.
     *
     * @param  list<InboxInterval>  $intervals
     */
    public function handOff(Message $agentPost, array $intervals): void
    {
        if ($agentPost->addressee_type === null || $agentPost->user_root_id === null) {
            return;
        }

        $addressee = array_find(
            $intervals,
            fn (InboxInterval $interval) => $interval->actor->type->isAgent()
                && $interval->actor_type === $agentPost->addressee_type
                && $interval->actor_id === $agentPost->addressee_id,
        );

        if ($addressee === null) {
            return;
        }

        $hasTurn = SpeechOpportunity::query()->onRoot($agentPost->user_root_id)
            ->where('actor_type', $addressee->actor_type)
            ->where('actor_id', $addressee->actor_id)
            ->exists();

        if ($hasTurn) {
            return;
        }

        $root = Message::query()->acrossInboxes()->findOrFail($agentPost->user_root_id);
        SpeechOpportunity::create($root, $addressee->actor, $addressee);
    }

    /**
     * The open turn of the agent another agent's question names, taken for that question; none when the question
     * is not one agent asking another. A turn already claimed, kept or spent makes the question fail whole.
     *
     * @throws SpeechRefused
     */
    public function targetTurnFor(ChatEnvelope $chat, Inbox $inbox): SpeechOpportunity|null
    {
        if (! $chat->isQuestion() || $chat->respondent === null || ! $chat->respondent->type->isAgent()) {
            return null;
        }

        $turn = SpeechOpportunity::query()
            ->where('inbox_id', $inbox->inboxId())
            ->onRoot((string) $chat->userRootId)
            ->where('actor_type', $chat->respondent->type->value)
            ->where('actor_id', $chat->respondent->id)
            ->lockForUpdate()
            ->first();

        if ($turn === null || $turn->state !== SpeechOpportunityState::Offered || $turn->isReserved()) {
            throw SpeechRefused::targetBusy($chat->respondent->id);
        }

        return $turn;
    }

    /**
     * Claims the actor's turn on the user message: a fresh token each time, and the token before it no longer holds.
     *
     * @throws InboxUnavailable
     * @throws SpeechRefused
     */
    public function claim(
        string $inboxId,
        ActorContext $actor,
        string $rootId,
        string $batchId,
        string $grant,
        CarbonImmutable $at,
    ): string {
        $opportunity = $this->lockedTurn($inboxId, $actor, $rootId);
        $this->assertGrant($opportunity, $rootId, $batchId, $grant, $at);
        $token = bin2hex(random_bytes(self::TOKEN_BYTES));
        $opportunity->claim(self::digestOf($token), $at->addSeconds(self::LEASE_SECONDS));

        return $token;
    }

    /**
     * Claims the reader's turn kept for the question it takes up, without handing out a token: the agent then answers
     * or declines through the ordinary commands while the lease runs. Answers whether a turn was claimed.
     */
    public function claimOnTakeUp(
        Message $question,
        ActorIdentity $reader,
        string $intervalId,
        CarbonImmutable $at,
    ): bool {
        $opportunity = SpeechOpportunity::query()
            ->where('reserved_question_id', $question->id)
            ->openFor($reader)
            ->lockForUpdate()
            ->first();

        if ($opportunity === null || $opportunity->interval_id !== $intervalId) {
            return false;
        }

        $unsharedToken = bin2hex(random_bytes(self::TOKEN_BYTES));
        $opportunity->claim(self::digestOf($unsharedToken), $at->addSeconds(self::LEASE_SECONDS));

        return true;
    }

    /**
     * A claim must come from the turn that was shown the text: the actionable batch of the agent's own session and
     * interval, its grant, its lease still running and the user message among what it carried.
     *
     * @throws SpeechRefused
     */
    private function assertGrant(
        SpeechOpportunity $opportunity,
        string $rootId,
        string $batchId,
        string $grant,
        CarbonImmutable $at,
    ): void {
        $batch = PresentationBatch::query()->whereKey($batchId)->lockForUpdate()->first();

        $isOwnTurn = $batch !== null
            && $batch->interval_id === $opportunity->interval_id
            && $this->session->hasSession()
            && $batch->agent_session_id === $this->session->sessionId()
            && $batch->admitsClaim(hash('sha256', $grant), $at)
            && $batch->carriesRoot($rootId);

        if (! $isOwnTurn) {
            throw SpeechRefused::notThisTurn();
        }
    }

    /**
     * @throws InboxUnavailable
     * @throws SpeechRefused
     */
    public function release(string $inboxId, ActorContext $actor, string $rootId): void
    {
        $this->lockedTurn($inboxId, $actor, $rootId)->release();
    }

    /**
     * The turn an agent's write is made under, checked under the inbox lock: its token, its lease, its interval and
     * any question it is kept for.
     *
     * @throws SpeechRefused
     */
    public function requireClaim(
        Inbox $inbox,
        ActorIdentity $actor,
        string $intervalId,
        string|null $token,
        ChatEnvelope $chat,
    ): SpeechOpportunity {
        $opportunity = $token === null
            ? $this->liveClaimOn($inbox, $actor, $intervalId, $chat->userRootId)
            : $this->claimedTurn($inbox, $actor, $intervalId, $token);

        if ($opportunity->isReserved() && ! $chat->isAnswerTo((string) $opportunity->reserved_question_id)) {
            throw SpeechRefused::reservedFor((string) $opportunity->reserved_question_id);
        }

        return $opportunity;
    }

    /**
     * Spends the turn kept for the question by declining it.
     *
     * @throws SpeechRefused
     */
    public function declineWith(
        Inbox $inbox,
        ActorIdentity $actor,
        string $intervalId,
        string|null $token,
        Message $question,
    ): void {
        $opportunity = $token === null
            ? $this->liveClaimOn($inbox, $actor, $intervalId, $question->user_root_id)
            : $this->claimedTurn($inbox, $actor, $intervalId, $token);

        if ($opportunity->reserved_question_id !== $question->id) {
            throw SpeechRefused::noTurn($question->id);
        }

        $opportunity->decline();
    }

    /**
     * @throws SpeechRefused
     */
    private function claimedTurn(
        Inbox $inbox,
        ActorIdentity $actor,
        string $intervalId,
        string|null $token,
    ): SpeechOpportunity {
        if ($token === null) {
            throw SpeechRefused::unclaimed();
        }

        $digest = self::digestOf($token);

        $opportunity = SpeechOpportunity::query()
            ->where('inbox_id', $inbox->inboxId())
            ->openFor($actor)
            ->where('claim_token_digest', $digest)
            ->lockForUpdate()
            ->first();

        if ($opportunity === null
            || $opportunity->interval_id !== $intervalId
            || ! $opportunity->isLeasedTo($digest, CarbonImmutable::now())) {
            throw SpeechRefused::staleClaim();
        }

        return $opportunity;
    }

    /**
     * The actor's claimed turn on the user message a token-less write belongs under, while its lease still runs: a
     * claim the journal took for the agent on take-up, used through the ordinary reply and answer commands.
     *
     * @throws SpeechRefused
     */
    private function liveClaimOn(
        Inbox $inbox,
        ActorIdentity $actor,
        string $intervalId,
        string|null $rootId,
    ): SpeechOpportunity {
        if ($rootId === null) {
            throw SpeechRefused::unclaimed();
        }

        $opportunity = SpeechOpportunity::query()
            ->where('inbox_id', $inbox->inboxId())
            ->onRoot($rootId)
            ->openFor($actor)
            ->where('state', SpeechOpportunityState::Claimed)
            ->where('lease_expires_at', '>', CarbonImmutable::now())
            ->lockForUpdate()
            ->first();

        if ($opportunity === null || $opportunity->interval_id !== $intervalId) {
            throw SpeechRefused::unclaimed();
        }

        return $opportunity;
    }

    /**
     * The actor's open turn on the root, under the inbox lock and its own row lock, held through its current interval.
     *
     * @throws InboxUnavailable
     * @throws SpeechRefused
     */
    private function lockedTurn(string $inboxId, ActorContext $actor, string $rootId): SpeechOpportunity
    {
        $inbox = $this->inboxes->resolve($inboxId);
        $access = $this->inboxes->accessFor($inbox);
        $access->lockExclusive($inbox);
        $intervalId = $access->membership($inbox, $actor)->interval();

        $opportunity = SpeechOpportunity::query()
            ->where('inbox_id', $inboxId)
            ->onRoot($rootId)
            ->openFor(ActorIdentity::of($actor))
            ->lockForUpdate()
            ->first();

        if ($opportunity === null || $opportunity->interval_id !== $intervalId) {
            throw SpeechRefused::noTurn($rootId);
        }

        return $opportunity;
    }

    /**
     * Whether a user's post offers this agent a turn: a broadcast offers every agent, a post addressed to an agent
     * only that agent, and a post addressed to a user none.
     */
    private function isOfferedTo(Message $userMessage, InboxInterval $interval): bool
    {
        if ($userMessage->addressee_type === null) {
            return true;
        }

        return $userMessage->addressee_type === $interval->actor_type
            && $userMessage->addressee_id === $interval->actor_id;
    }

    private function isAskedOf(Message $userMessage, ActorIdentity $agent, int $agentCount): bool
    {
        if (! $userMessage->needsReply()) {
            return false;
        }

        if ($userMessage->respondent_type === null) {
            return $agentCount === 1;
        }

        return $userMessage->respondent_type === $agent->type->value && $userMessage->respondent_id === $agent->id;
    }

    private static function digestOf(string $token): string
    {
        return hash('sha256', $token);
    }
}
