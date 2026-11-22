<?php

declare(strict_types=1);

namespace App\Communication\Models;

use App\Communication\Enums\PresentationBatchState;
use App\Communication\Exceptions\ChatStateConflict;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
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
 * @property PresentationBatchState $state
 * @property CarbonImmutable|null $settled_at
 * @property CarbonImmutable $dispatched_at
 * @property CarbonImmutable $last_progress_at
 * @property CarbonImmutable $lease_expires_at
 * @property int $attempt
 * @property string|null $claim_grant_digest
 */
#[Table('presentation_batches')]
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
final class PresentationBatch extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'state' => PresentationBatchState::class,
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
    public static function dispatch(
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
            'state' => PresentationBatchState::Dispatched,
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
        $this->save();
    }

    /**
     * Confirms one of the batch's pieces by its handle digest: the piece, its outstanding range and the context's
     * progress move together. Answers whether this confirmation changed anything.
     *
     * @throws ChatStateConflict
     */
    public function confirmRange(string $handleDigest, CarbonImmutable $at): bool
    {
        if ($this->state->isSettled()) {
            throw ChatStateConflict::batchSettled($this->id);
        }

        $range = $this->ranges()->where('handle_digest', $handleDigest)->first();

        if ($range === null || ! $range->confirm($at)) {
            return false;
        }

        $range->outstanding->confirm();
        ReceiptProgress::of($range->receipt_id, $this->context_key)->advanceTo($range->end_offset);
        $this->last_progress_at = $at;
        $this->save();

        return true;
    }

    /**
     * Settles the attempt once, as confirmed or failed; a settled batch never changes again.
     *
     * @throws ChatStateConflict
     */
    public function settle(PresentationBatchState $outcome, CarbonImmutable $at): void
    {
        if ($this->state->isSettled()) {
            throw ChatStateConflict::batchSettled($this->id);
        }

        $this->state = $outcome;
        $this->settled_at = $at;
        $this->save();
    }

    /**
     * The lease ran out with no word from the driver.
     *
     * @throws ChatStateConflict
     */
    public function expire(CarbonImmutable $at): void
    {
        $this->settle(PresentationBatchState::Expired, $at);
    }

    /**
     * Makes the batch actionable: it carries the digest of a grant only the receiving turn holds.
     */
    public function grantClaims(string $grantDigest): void
    {
        $this->claim_grant_digest = $grantDigest;
        $this->save();
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
     * @return HasMany<PresentationRange, $this>
     */
    public function ranges(): HasMany
    {
        return $this->hasMany(PresentationRange::class, 'batch_id');
    }
}
