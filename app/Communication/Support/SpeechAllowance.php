<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Communication\Contracts\Inbox;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Exceptions\InboxUnavailable;
use App\Communication\Exceptions\SpeechRefused;
use App\Communication\Models\InboxInterval;
use App\Communication\Models\Message;
use App\Communication\Models\SpeechOpportunity;
use Carbon\CarbonImmutable;

/**
 * Who may speak in a chat: a user's message gives each agent member one turn, kept for a question the user put to
 * it; an agent claims its turn for two minutes under an opaque token and writes once with it. Users need no claim.
 */
final readonly class SpeechAllowance
{
    public const int LEASE_SECONDS = 120;

    private const int TOKEN_BYTES = 32;

    public function __construct(private InboxResolver $inboxes) {}

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
            fn (InboxInterval $interval) => $interval->actor->type->isAgent(),
        ));

        foreach ($agents as $interval) {
            $opportunity = SpeechOpportunity::offer($userMessage, $interval->actor, $interval);

            if ($this->isAskedOf($userMessage, $interval->actor, count($agents))) {
                $opportunity->reserveFor($userMessage);
            }
        }
    }

    /**
     * Claims the actor's turn on the user message: a fresh token each time, and the token before it no longer holds.
     *
     * @throws InboxUnavailable
     * @throws SpeechRefused
     */
    public function claim(string $inboxId, ActorContext $actor, string $rootId, CarbonImmutable $at): string
    {
        $opportunity = $this->lockedTurn($inboxId, $actor, $rootId);
        $token = bin2hex(random_bytes(self::TOKEN_BYTES));
        $opportunity->claim(self::digestOf($token), $at->addSeconds(self::LEASE_SECONDS));

        return $token;
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
        $opportunity = $this->claimedTurn($inbox, $actor, $intervalId, $token);

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
        $opportunity = $this->claimedTurn($inbox, $actor, $intervalId, $token);

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
