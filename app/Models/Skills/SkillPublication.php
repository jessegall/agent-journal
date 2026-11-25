<?php

declare(strict_types=1);

namespace App\Models\Skills;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\PublicationState;
use App\Events\Skills\SkillPublicationClaimed;
use App\Events\Skills\SkillPublicationMoved;
use App\Events\Skills\SkillPublicationProgressed;
use App\Exceptions\SkillPublicationFailed;
use App\Exceptions\SkillPublicationMissing;
use App\Exceptions\SkillPublicationStale;
use App\Values\PublicationIntent;
use App\Values\PublicationManifest;
use App\Values\PublicationStatus;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * The durable intent to deliver one generation's selection to one session's target, and how far it got: each worker
 * claims it under a new fencing version, so an older worker can never overwrite a newer one. Its manifest holds only
 * safe identities and hashes.
 *
 * @property string $id
 * @property string $session_id
 * @property string $skill_protocol the skill format the publication is written for, which every driver of its family reads
 * @property string $target
 * @property string $generation_id
 * @property string $selection_digest
 * @property list<string> $skill_keys
 * @property string|null $expected_previous_generation_id
 * @property int $fencing_version
 * @property string|null $lease_holder
 * @property CarbonImmutable|null $lease_until
 * @property int $progress
 * @property PublicationState $state
 * @property string|null $open_key
 * @property array<string, mixed>|null $manifest
 * @property string|null $error
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'session_id',
    'skill_protocol',
    'target',
    'generation_id',
    'selection_digest',
    'skill_keys',
    'expected_previous_generation_id',
    'fencing_version',
    'lease_holder',
    'lease_until',
    'progress',
    'state',
    'open_key',
    'manifest',
    'error',
])]
final class SkillPublication extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'fencing_version' => 'integer',
            'lease_until' => 'immutable_datetime',
            'progress' => 'integer',
            'skill_keys' => 'array',
            'state' => PublicationState::class,
            'manifest' => 'array',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A pending intent to deliver the generation's selection to the session's target, the target's one open intent.
     */
    public static function create(
        SkillGeneration $generation,
        PublicationIntent $intent,
        string|null $expectedPreviousGenerationId,
    ): self {
        return self::query()->create([
            'session_id' => $intent->sessionId,
            'skill_protocol' => $intent->driver,
            'target' => $intent->target,
            'generation_id' => $generation->id,
            'selection_digest' => $intent->selectionDigest,
            'skill_keys' => $intent->skillKeys,
            'expected_previous_generation_id' => $expectedPreviousGenerationId,
            'state' => PublicationState::Pending,
            'open_key' => self::openKeyOf($intent->sessionId, $intent->target),
        ]);
    }

    // ----------[ Mutations ]----------

    /**
     * Takes the publication for one worker under a new fencing version and a lease; answers that version.
     */
    public function claim(string $holder, CarbonImmutable $leaseUntil): int
    {
        $this->moveTo(PublicationState::Preparing);
        $this->fencing_version++;
        $this->lease_holder = $holder;
        $this->lease_until = $leaseUntil;
        $this->save();
        $this->raise(new SkillPublicationClaimed($this->id, $this->fencing_version));

        return $this->fencing_version;
    }

    /**
     * @throws SkillPublicationStale when a newer worker holds it
     */
    public function recordProgress(int $fence, int $filesStaged): void
    {
        $this->assertHeldBy($fence);
        $this->progress = $filesStaged;
        $this->save();
        $this->raise(new SkillPublicationProgressed($this->id, $filesStaged));
    }

    /**
     * @throws SkillPublicationStale when a newer worker holds it
     */
    public function deliver(int $fence, PublicationManifest $manifest): void
    {
        $this->assertHeldBy($fence);
        $this->moveTo(PublicationState::Delivered);
        $this->manifest = $manifest->jsonSerialize();
        $this->open_key = null;
        $this->lease_holder = null;
        $this->lease_until = null;
        $this->save();
        $this->raiseMoved();
    }

    public function fail(string $reason): void
    {
        $this->moveTo(PublicationState::Failed);
        $this->error = $reason;
        $this->open_key = null;
        $this->lease_holder = null;
        $this->lease_until = null;
        $this->save();
        $this->raiseMoved();
    }

    /**
     * A failed publication waits again for a worker, with the same immutable generation; once the target has a newer
     * publication, only a refresh makes a new one.
     */
    public function retry(): void
    {
        $this->assertNewest();
        $this->moveTo(PublicationState::Pending);
        $this->error = null;
        $this->open_key = self::openKeyOf($this->session_id, $this->target);
        $this->save();
        $this->raiseMoved();
    }

    public function supersede(): void
    {
        $this->moveTo(PublicationState::Superseded);
        $this->open_key = null;
        $this->save();
        $this->raiseMoved();
    }

    public function retire(): void
    {
        $this->moveTo(PublicationState::Retired);
        $this->save();
        $this->raiseMoved();
    }

    // ----------[ Predicates ]----------

    public function isHeldBy(int $fence): bool
    {
        return $this->fencing_version === $fence;
    }

    public function isClaimable(CarbonImmutable $now): bool
    {
        if ($this->state === PublicationState::Pending) {
            return true;
        }

        return $this->state === PublicationState::Preparing
            && ($this->lease_until === null || $this->lease_until->lessThan($now));
    }

    /**
     * Whether it was ever delivered whole: only then does it hold a manifest.
     */
    public function wasDelivered(): bool
    {
        return $this->manifest !== null;
    }

    /**
     * Whether a failed publication may still be retried by hand.
     */
    public function awaitsRetry(CarbonImmutable $retentionStart): bool
    {
        return $this->state === PublicationState::Failed && ! $this->endedBefore($retentionStart);
    }

    public function endedBefore(CarbonImmutable $moment): bool
    {
        return $this->updated_at !== null && $this->updated_at->lessThan($moment);
    }

    // ----------[ Transformers ]----------

    /**
     * The immutable generation this publication delivers.
     */
    public function generation(): SkillGeneration
    {
        return SkillGeneration::query()->whereKey($this->generation_id)->firstOrFail();
    }

    // ----------[ Accessors ]----------

    /**
     * The one name of its session's target, so publications of one target are counted together.
     *
     * @return Attribute<string, never>
     */
    protected function targetName(): Attribute
    {
        return Attribute::get(fn () => self::openKeyOf($this->session_id, $this->target));
    }

    /**
     * @return Attribute<PublicationStatus, never>
     */
    protected function status(): Attribute
    {
        return Attribute::get(fn () => new PublicationStatus(
            $this->id,
            $this->session_id,
            $this->state,
            $this->generation_id,
            $this->selection_digest,
            $this->target,
            $this->error,
        ))->withoutObjectCaching();
    }

    /**
     * The open key of this publication's session target.
     *
     * @return Attribute<string, never>
     */
    protected function targetKey(): Attribute
    {
        return Attribute::get(fn () => self::openKeyOf($this->session_id, $this->target));
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a retry of a publication a newer one for the same target replaced.
     *
     * @throws SkillPublicationFailed
     */
    private function assertNewest(): void
    {
        $hasNewer = self::query()
            ->forTarget($this->session_id, $this->target)
            ->madeAfter($this)
            ->exists();

        if ($hasNewer) {
            throw SkillPublicationFailed::newerExists($this->id);
        }
    }

    /**
     * Refuses a publication that is not there.
     *
     * @phpstan-assert self $row
     *
     * @throws SkillPublicationMissing
     */
    private static function assertFound(self|null $row, string $publicationId): void
    {
        if ($row === null) {
            throw SkillPublicationMissing::for($publicationId);
        }
    }

    /**
     * Refuses a move its present state does not allow.
     *
     * @throws SkillPublicationFailed
     */
    private function assertMayMoveTo(PublicationState $next): void
    {
        if (! $this->state->canMoveTo($next)) {
            throw SkillPublicationFailed::transition($this->state, $next);
        }
    }

    /**
     * @throws SkillPublicationStale when a newer worker holds it
     */
    private function assertHeldBy(int $fence): void
    {
        if (! $this->isHeldBy($fence)) {
            throw SkillPublicationStale::for($fence, $this->fencing_version);
        }
    }

    // ----------[ Internals ]----------

    /**
     * @throws SkillPublicationFailed
     */
    private function moveTo(PublicationState $next): void
    {
        $this->assertMayMoveTo($next);

        $this->state = $next;
    }

    /**
     * Raised after the save, so the fact belongs to the committed move.
     */
    private function raiseMoved(): void
    {
        $this->raise(new SkillPublicationMoved($this->id, $this->session_id, $this->state));
    }

    // ----------[ Queries ]----------

    public static function openKeyOf(string $sessionId, string $target): string
    {
        return $sessionId.'|'.$target;
    }

    /**
     * The selection digest of each session's newest open or delivered publication, by session id, in one query.
     *
     * @param  list<string>  $sessionIds
     * @return array<string, string>
     */
    public static function currentSelectionsOf(array $sessionIds): array
    {
        $publications = self::query()
            ->ofSessions($sessionIds)
            ->inAnyState([
                PublicationState::Pending,
                PublicationState::Preparing,
                PublicationState::Delivered,
            ])
            ->newestFirst()
            ->readExactly(max(1, 2 * count($sessionIds)))
            ->get()
            ->unique('session_id');

        return $publications->mapWithKeys(fn (self $publication) => [
            $publication->session_id => $publication->selection_digest,
        ])->all();
    }

    /**
     * @throws SkillPublicationMissing
     */
    public static function lockById(string $publicationId): self
    {
        $row = self::query()->whereKey($publicationId)->lockForUpdate()->first();
        self::assertFound($row, $publicationId);

        return $row;
    }

    /**
     * Every publication no worker will touch again and not yet retired, newest first, for the daily prune.
     *
     * @return list<self>
     */
    public static function settled(int $limit): array
    {
        $settled = self::query()
            ->inAnyState([
                PublicationState::Delivered,
                PublicationState::Failed,
                PublicationState::Superseded,
            ])
            ->newestFirst()
            ->readExactly($limit)
            ->get();

        return array_values($settled->all());
    }

    /**
     * Every publication still waiting for a worker, oldest first.
     *
     * @return list<self>
     */
    public static function open(int $limit): array
    {
        $open = self::query()
            ->inAnyState([
                PublicationState::Pending,
                PublicationState::Preparing,
            ])
            ->oldestFirst()
            ->readExactly($limit)
            ->get();

        return array_values($open->all());
    }

    /**
     * The newest publication of each of these sessions, for status; an agent passes only its own session.
     *
     * @param  list<string>  $ids
     * @return list<self>
     */
    public static function latestOfSessions(array $ids, int $limit): array
    {
        $latest = self::query()
            ->ofSessions($ids)
            ->newestFirst()
            ->readExactly($limit)
            ->get()
            ->unique('session_id');

        return array_values($latest->all());
    }

    /**
     * Where each of these publications stands, by id; an id that names none is left out.
     *
     * @param  list<string>  $ids
     * @return array<string, PublicationState>
     */
    public static function statesOf(array $ids): array
    {
        $publications = self::query()->whereKey($ids)->readExactly(max(1, count($ids)))->get();

        return $publications->mapWithKeys(fn (self $publication) => [$publication->id => $publication->state])->all();
    }

    /**
     * The session's first publication: the set its driver was started with, which a driver that loads skills only
     * at a new session keeps.
     */
    public static function firstOfSession(string $sessionId): self
    {
        return self::query()
            ->ofSessions([$sessionId])
            ->oldestFirst()
            ->firstOrFail();
    }

    /**
     * The session's newest delivered publication, or null when none was delivered yet.
     */
    public static function latestDeliveredOfSession(string $sessionId): self|null
    {
        return self::query()
            ->ofSessions([$sessionId])
            ->inState(PublicationState::Delivered)
            ->newestFirst()
            ->first();
    }

    /**
     * The session's newest publication, or null when none was asked for it.
     */
    public static function latestOfSession(string $sessionId): self|null
    {
        return self::query()
            ->ofSessions([$sessionId])
            ->newestFirst()
            ->first();
    }

    /**
     * The newest publication of every session, for a user's status.
     *
     * @return list<self>
     */
    public static function latestOfEverySession(int $limit): array
    {
        $latest = self::query()
            ->newestFirst()
            ->readExactly($limit)
            ->get()
            ->unique('session_id');

        return array_values($latest->all());
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forTarget(Builder $query, string $sessionId, string $target): void
    {
        $query->where('session_id', $sessionId)->where('target', $target);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inState(Builder $query, PublicationState $state): void
    {
        $query->where('state', $state->value);
    }

    /**
     * The publications made after that one.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function madeAfter(Builder $query, self $publication): void
    {
        $query->where('created_at', '>', $publication->created_at);
    }

    /**
     * The publications of the sessions.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $sessionIds
     */
    #[Scope]
    protected function ofSessions(Builder $query, array $sessionIds): void
    {
        $query->whereIn('session_id', $sessionIds);
    }

    /**
     * The publications in any of the states.
     *
     * @param  Builder<self>  $query
     * @param  list<PublicationState>  $states
     */
    #[Scope]
    protected function inAnyState(Builder $query, array $states): void
    {
        $query->whereIn('state', array_map(fn (PublicationState $state) => $state->value, $states));
    }
}
