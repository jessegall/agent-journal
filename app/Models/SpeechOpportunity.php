<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\ActorType;
use App\Enums\SpeechOpportunityState;
use App\Events\SpeechOpportunitySettled;
use App\Exceptions\ChatStateConflict;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One agent's single turn to speak on one user message in a chat: offered when the message arrives, claimed under a
 * lease whose version rises with each claim, and spent by the one contribution it allows.
 *
 * @property string $id
 * @property string $inbox_id
 * @property string $user_root_id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $interval_id
 * @property SpeechOpportunityState $state
 * @property string|null $reserved_question_id
 * @property int $lease_version
 * @property string|null $claim_token_digest
 * @property CarbonImmutable|null $lease_expires_at
 * @property string|null $contribution_message_id
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read ActorIdentity $actor
 */
#[Table('speech_opportunities')]
#[Fillable(['inbox_id', 'user_root_id', 'actor_type', 'actor_id', 'interval_id', 'state', 'lease_version'])]
final class SpeechOpportunity extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'state' => SpeechOpportunityState::class,
            'lease_version' => 'integer',
            'lease_expires_at' => 'immutable_datetime',
            'created_at' => 'immutable_datetime',
            'updated_at' => 'immutable_datetime',
        ];
    }

    /**
     * The actor's turn to speak on the user message, held through the interval it had when the message arrived.
     */
    public static function create(Message $root, ActorIdentity $actor, InboxInterval $interval): self
    {
        $opportunity = new self([
            'inbox_id' => $interval->inbox_id,
            'user_root_id' => $root->id,
            ...$actor->asColumns('actor'),
            'interval_id' => $interval->id,
            'state' => SpeechOpportunityState::Offered,
            'lease_version' => 0,
        ]);

        $opportunity->assertSaved($opportunity->save());

        return $opportunity;
    }

    // ----------[ Mutations ]----------

    /**
     * Ties the turn to the question its contribution must answer.
     *
     * @throws ChatStateConflict
     */
    public function reserveFor(Message $question): void
    {
        $this->assertOpen();
        $this->reserved_question_id = $question->id;
        $this->assertSaved($this->save());
    }

    /**
     * Takes the turn under a new lease: the version rises, so a holder of an older lease is refused.
     *
     * @throws ChatStateConflict
     */
    public function claim(string $tokenDigest, CarbonImmutable $expiresAt): void
    {
        $this->assertOpen();
        $this->state = SpeechOpportunityState::Claimed;
        $this->lease_version++;
        $this->claim_token_digest = $tokenDigest;
        $this->lease_expires_at = $expiresAt;
        $this->assertSaved($this->save());
    }

    /**
     * Gives the claim up: the turn is offered again, its reservation kept, and the released token no longer holds.
     *
     * @throws ChatStateConflict
     */
    public function release(): void
    {
        if ($this->state !== SpeechOpportunityState::Claimed) {
            throw ChatStateConflict::opportunityNotClaimed($this->id);
        }

        $this->state = SpeechOpportunityState::Offered;
        $this->releaseLease();
        $this->assertSaved($this->save());
    }

    /**
     * @throws ChatStateConflict
     */
    public function spend(Message $contribution): void
    {
        if ($this->state !== SpeechOpportunityState::Claimed) {
            throw ChatStateConflict::opportunityNotClaimed($this->id);
        }

        $this->state = SpeechOpportunityState::Spent;
        $this->contribution_message_id = $contribution->id;
        $this->releaseLease();
        $this->settle();
    }

    /**
     * @throws ChatStateConflict
     */
    public function decline(): void
    {
        $this->assertOpen();
        $this->state = SpeechOpportunityState::Declined;
        $this->releaseLease();
        $this->settle();
    }

    /**
     * @throws ChatStateConflict
     */
    public function cancel(): void
    {
        $this->assertOpen();
        $this->state = SpeechOpportunityState::Cancelled;
        $this->releaseLease();
        $this->settle();
    }

    // ----------[ Answers ]----------

    public function isOpen(): bool
    {
        return $this->state->isOpen();
    }

    public function isReserved(): bool
    {
        return $this->reserved_question_id !== null;
    }

    /**
     * Whether the token belongs to the current lease and the lease still runs.
     */
    public function isLeasedTo(string $tokenDigest, CarbonImmutable $at): bool
    {
        return $this->isLeased($at)
            && $this->claim_token_digest !== null
            && hash_equals($this->claim_token_digest, $tokenDigest);
    }

    /**
     * Whether the turn is claimed under a lease that still runs.
     */
    public function isLeased(CarbonImmutable $at): bool
    {
        return $this->state === SpeechOpportunityState::Claimed
            && $this->lease_expires_at !== null
            && $this->lease_expires_at->greaterThan($at);
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<ActorIdentity, never>
     */
    protected function actor(): Attribute
    {
        return Attribute::get(fn () => new ActorIdentity(ActorType::from($this->actor_type), $this->actor_id));
    }

    // ----------[ Internals ]----------

    /**
     * @throws ChatStateConflict
     */
    private function assertOpen(): void
    {
        if (! $this->isOpen()) {
            throw ChatStateConflict::opportunityClosed($this->id);
        }
    }

    private function settle(): void
    {
        $this->assertSaved($this->save());
        $this->raise(new SpeechOpportunitySettled($this->id, $this->user_root_id, $this->actor, $this->state));
    }

    private function releaseLease(): void
    {
        $this->claim_token_digest = null;
        $this->lease_expires_at = null;
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function openFor(Builder $query, ActorIdentity $actor): void
    {
        $query->where('actor_type', $actor->type->value)
            ->where('actor_id', $actor->id)
            ->whereIn('state', [SpeechOpportunityState::Offered, SpeechOpportunityState::Claimed]);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function onRoot(Builder $query, string $userRootId): void
    {
        $query->where('user_root_id', $userRootId);
    }

    /**
     * The offered and claimed turns held through one interval.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function openOnInterval(Builder $query, string $intervalId): void
    {
        $query->where('interval_id', $intervalId)
            ->whereIn('state', [SpeechOpportunityState::Offered, SpeechOpportunityState::Claimed]);
    }
}
