<?php

declare(strict_types=1);

namespace App\Models\Messages;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\MessageBatchState;
use App\Events\MessageBatchClaimsGranted;
use App\Events\MessageBatchProgressed;
use App\Events\MessageBatchSettled;
use App\Events\MessageBatchTurnBound;
use App\Exceptions\ChatStateConflict;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * One attempt to present a member's unread chat text to its agent's driver in one receiving context: sent under a
 * lease, bound to the driver's own turn once known, and settled once, as confirmed, expired or failed.
 *
 * @property string $id
 * @property string $interval_id
 * @property string $agent_session_id
 * @property int $runtime_generation
 * @property string $context_key
 * @property string|null $driver_turn_id
 * @property MessageBatchState $state
 * @property CarbonImmutable|null $settled_at
 * @property CarbonImmutable $dispatched_at
 * @property CarbonImmutable $last_progress_at
 * @property CarbonImmutable $lease_expires_at
 * @property int $attempt
 * @property string|null $claim_grant_digest
 */
#[Table('message_batches')]
#[Fillable([
    'interval_id',
    'agent_session_id',
    'runtime_generation',
    'context_key',
    'state',
    'dispatched_at',
    'last_progress_at',
    'lease_expires_at',
    'attempt',
])]
final class MessageBatch extends Model implements EventSource, ReadableModel
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
            'state' => MessageBatchState::class,
            'runtime_generation' => 'integer',
            'attempt' => 'integer',
            'settled_at' => 'immutable_datetime',
            'dispatched_at' => 'immutable_datetime',
            'last_progress_at' => 'immutable_datetime',
            'lease_expires_at' => 'immutable_datetime',
        ];
    }

    /**
     * A new batch sent to the session's driver in the receiving context, leased until the given time.
     */
    public static function create(
        string $intervalId,
        string $sessionId,
        int $runtimeGeneration,
        string $contextKey,
        int $attempt,
        CarbonImmutable $at,
        CarbonImmutable $leaseUntil,
    ): self {
        $batch = new self([
            'interval_id' => $intervalId,
            'agent_session_id' => $sessionId,
            'runtime_generation' => $runtimeGeneration,
            'context_key' => $contextKey,
            'state' => MessageBatchState::Dispatched,
            'dispatched_at' => $at,
            'last_progress_at' => $at,
            'lease_expires_at' => $leaseUntil,
            'attempt' => $attempt,
        ]);

        $batch->save();

        return $batch;
    }

    // ----------[ Mutations ]----------

    /**
     * Ties the batch to the driver's own turn that took it.
     */
    public function bindTurn(string $driverTurnId): void
    {
        $this->driver_turn_id = $driverTurnId;
        $this->assertSaved($this->save());
        $this->raise(new MessageBatchTurnBound($this->id, $driverTurnId));
    }

    /**
     * Notes that one of the batch's pieces was confirmed at the time.
     */
    public function recordProgress(CarbonImmutable $at): void
    {
        $this->last_progress_at = $at;
        $this->assertSaved($this->save());
        $this->raise(new MessageBatchProgressed($this->id));
    }

    /**
     * The batch's piece with the handle digest, with its outstanding range, once there is one.
     */
    public function rangeWithDigest(string $handleDigest): MessageRange|null
    {
        return $this->ranges()->where('handle_digest', $handleDigest)->with('outstanding')->first();
    }

    /**
     * Settles the attempt once, as confirmed or failed; a settled batch never changes again.
     *
     * @throws ChatStateConflict
     */
    public function settle(MessageBatchState $outcome, CarbonImmutable $at): void
    {
        if ($this->state->isSettled()) {
            throw ChatStateConflict::batchSettled($this->id);
        }

        $this->state = $outcome;
        $this->settled_at = $at;
        $this->assertSaved($this->save());
        $this->raise(new MessageBatchSettled($this->id, $outcome));
    }

    /**
     * The lease ran out with no word from the driver.
     *
     * @throws ChatStateConflict
     */
    public function expire(CarbonImmutable $at): void
    {
        $this->settle(MessageBatchState::Expired, $at);
    }

    /**
     * Makes the batch actionable: it carries the digest of a grant only the receiving turn holds.
     */
    public function grantClaims(string $digest): void
    {
        $this->claim_grant_digest = $digest;
        $this->assertSaved($this->save());
        $this->raise(new MessageBatchClaimsGranted($this->id));
    }

    // ----------[ Answers ]----------

    /**
     * Whether the grant belongs to this batch and its turn still runs, so a claim may present it.
     */
    public function admitsClaim(string $grantDigest, CarbonImmutable $at): bool
    {
        return ! $this->state->isSettled()
            && $this->claim_grant_digest !== null
            && hash_equals($this->claim_grant_digest, $grantDigest)
            && $this->lease_expires_at->greaterThan($at);
    }

    /**
     * Whether the batch carried a piece of a message under the user message.
     */
    public function carriesRoot(string $rootId): bool
    {
        $underRoot = Message::query()->acrossInboxes()->where('user_root_id', $rootId)->select('id');

        return $this->ranges()
            ->whereIn('receipt_id', MessageReceipt::query()->whereIn('message_id', $underRoot)->select('id'))
            ->exists();
    }

    // ----------[ Relations ]----------

    /**
     * @return HasMany<MessageRange, $this>
     */
    public function ranges(): HasMany
    {
        return $this->hasMany(MessageRange::class, 'batch_id');
    }

    // ----------[ Scopes ]----------

    /**
     * The batches of one session and interval that carried a piece of a message under the user message.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function shownUnderRoot(Builder $query, string $sessionId, string $intervalId, string $rootId): void
    {
        $underRoot = Message::query()->acrossInboxes()->where('user_root_id', $rootId)->select('id');
        $receipts = MessageReceipt::query()->whereIn('message_id', $underRoot)->select('id');

        $query->where('agent_session_id', $sessionId)
            ->where('interval_id', $intervalId)
            ->whereIn('id', MessageRange::query()->whereIn('receipt_id', $receipts)->select('batch_id'));
    }
}
