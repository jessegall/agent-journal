<?php

declare(strict_types=1);

namespace App\Models\Skills;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\Skills\PublicationStatus;
use App\Events\Skills\SkillPublicationClaimed;
use App\Events\Skills\SkillPublicationMoved;
use App\Events\Skills\SkillPublicationProgressed;
use App\Exceptions\SkillPublicationFailed;
use App\Exceptions\SkillPublicationMissing;
use App\Exceptions\SkillPublicationStale;
use App\Models\Support\Accessor;
use App\Values\PublicationIntent;
use App\Values\PublicationManifest;
use App\Values\PublicationReport;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $session_id
 * @property string $skill_protocol
 * @property string $target
 * @property string $generation_id
 * @property string $selection_digest
 * @property list<string> $skill_keys
 * @property string|null $expected_previous_generation_id
 * @property int $fencing_version
 * @property string|null $lease_holder
 * @property CarbonImmutable|null $lease_until
 * @property int $progress
 * @property PublicationStatus $status
 * @property string|null $open_key
 * @property PublicationManifest|null $manifest
 * @property string|null $error
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read mixed $target_key
 * @property-read mixed $target_name
 *
 * @mixin \Eloquent
 */
final class SkillPublication extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

    /**
     * @return array<string, string>
     *
     * @column skill_keys list<string>
     */
    protected function casts(): array
    {
        return [
            'fencing_version' => 'integer',
            'lease_until' => 'immutable_datetime',
            'progress' => 'integer',
            'skill_keys' => 'array',
            'status' => PublicationStatus::class,
            'manifest' => PublicationManifest::class,
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
        $skillPublication = new self();
        $skillPublication->session_id = $intent->sessionId;
        $skillPublication->skill_protocol = $intent->driver;
        $skillPublication->target = $intent->target;
        $skillPublication->generation_id = $generation->id;
        $skillPublication->selection_digest = $intent->selectionDigest;
        $skillPublication->skill_keys = $intent->skillKeys;
        $skillPublication->expected_previous_generation_id = $expectedPreviousGenerationId;
        $skillPublication->status = PublicationStatus::Pending;
        $skillPublication->open_key = self::resolveOpenKeyOf($intent->sessionId, $intent->target);
        $skillPublication->assertSaved($skillPublication->save());

        return $skillPublication;
    }

    // ----------[ Mutations ]----------

    /**
     * Takes the publication for one worker under a new fencing version and a lease; answers that version.
     */
    public function claim(string $holder, CarbonImmutable $leaseUntil): int
    {
        $this->moveTo(PublicationStatus::Preparing);
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
        $this->moveTo(PublicationStatus::Delivered);
        $this->manifest = $manifest;
        $this->open_key = null;
        $this->lease_holder = null;
        $this->lease_until = null;
        $this->save();
        $this->raiseMoved();
    }

    public function fail(string $reason): void
    {
        $this->moveTo(PublicationStatus::Failed);
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
        $this->moveTo(PublicationStatus::Pending);
        $this->error = null;
        $this->open_key = self::resolveOpenKeyOf($this->session_id, $this->target);
        $this->save();
        $this->raiseMoved();
    }

    public function supersede(): void
    {
        $this->moveTo(PublicationStatus::Superseded);
        $this->open_key = null;
        $this->save();
        $this->raiseMoved();
    }

    public function retire(): void
    {
        $this->moveTo(PublicationStatus::Retired);
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
        if ($this->status === PublicationStatus::Pending) {
            return true;
        }

        return $this->status === PublicationStatus::Preparing
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
        return $this->status === PublicationStatus::Failed && ! $this->endedBefore($retentionStart);
    }

    public function endedBefore(CarbonImmutable $moment): bool
    {
        return $this->updated_at !== null && $this->updated_at->lessThan($moment);
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<PublicationReport, never>
     */
    protected function report(): Attribute
    {
        return Accessor::get(fn () => new PublicationReport(
            $this->id,
            $this->session_id,
            $this->status,
            $this->generation_id,
            $this->selection_digest,
            $this->target,
            $this->error,
        ));
    }

    /**
     * The one name of its session's target, so publications of one target are counted together.
     *
     * @return Attribute<string, never>
     */
    protected function targetName(): Attribute
    {
        return Accessor::get(fn () => self::resolveOpenKeyOf($this->session_id, $this->target));
    }

    /**
     * The open key of this publication's session target.
     *
     * @return Attribute<string, never>
     */
    protected function targetKey(): Attribute
    {
        return Accessor::get(fn () => self::resolveOpenKeyOf($this->session_id, $this->target));
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
     * Refuses a move its present state does not allow.
     *
     * @throws SkillPublicationFailed
     */
    private function assertMayMoveTo(PublicationStatus $next): void
    {
        if (! $this->status->canMoveTo($next)) {
            throw SkillPublicationFailed::transition($this->status, $next);
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
    private function moveTo(PublicationStatus $next): void
    {
        $this->assertMayMoveTo($next);

        $this->status = $next;
    }

    /**
     * Raised after the save, so the fact belongs to the committed move.
     */
    private function raiseMoved(): void
    {
        $this->raise(new SkillPublicationMoved($this->id, $this->session_id, $this->status));
    }

    // ----------[ Queries ]----------

    public static function resolveOpenKeyOf(string $sessionId, string $target): string
    {
        return $sessionId.'|'.$target;
    }

    /**
     * The selection digest of each session's newest open or delivered publication, by session id, in one query.
     *
     * @param  list<string>  $sessionIds
     * @return array<string, string>
     */
    public static function resolveCurrentSelectionsOf(array $sessionIds): array
    {
        $publications = self::query()
            ->ofSessions($sessionIds)
            ->inAnyState([
                PublicationStatus::Pending,
                PublicationStatus::Preparing,
                PublicationStatus::Delivered,
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
    public static function findLockedById(string $publicationId): self
    {
        return self::query()
            ->whereKey($publicationId)
            ->lockForUpdate()
            ->firstOr(SkillPublicationMissing::throwing()->for($publicationId));
    }

    /**
     * Every publication no worker will touch again and not yet retired, newest first, for the daily prune.
     *
     * @return list<self>
     */
    public static function findSettled(int $limit): array
    {
        $settled = self::query()
            ->inAnyState([
                PublicationStatus::Delivered,
                PublicationStatus::Failed,
                PublicationStatus::Superseded,
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
    public static function findOpen(int $limit): array
    {
        $open = self::query()
            ->inAnyState([
                PublicationStatus::Pending,
                PublicationStatus::Preparing,
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
    public static function findLatestOfSessions(array $ids, int $limit): array
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
     * @return array<string, PublicationStatus>
     */
    public static function resolveStatesOf(array $ids): array
    {
        $publications = self::query()->whereKey($ids)->readExactly(max(1, count($ids)))->get();

        return $publications->mapWithKeys(fn (self $publication) => [$publication->id => $publication->status])->all();
    }

    /**
     * The session's first publication: the set its driver was started with, which a driver that loads skills only
     * at a new session keeps.
     */
    public static function findFirstOfSession(string $sessionId): self
    {
        return self::query()
            ->ofSessions([$sessionId])
            ->oldestFirst()
            ->firstOrFail();
    }

    /**
     * The session's newest delivered publication, or null when none was delivered yet.
     */
    public static function findLatestDeliveredOfSession(string $sessionId): self|null
    {
        return self::query()
            ->ofSessions([$sessionId])
            ->inState(PublicationStatus::Delivered)
            ->newestFirst()
            ->first();
    }

    /**
     * The session's newest publication, or null when none was asked for it.
     */
    public static function findLatestOfSession(string $sessionId): self|null
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
    public static function findLatestOfEverySession(int $limit): array
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
    protected function inState(Builder $query, PublicationStatus $state): void
    {
        $query->where('status', $state->value);
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
     * @param  array<array-key, string>|Builder<covariant Model>|Closure  $ids
     */
    #[Scope]
    protected function ofSessions(Builder $query, array|Builder|Closure $ids): void
    {
        $query->whereIn('session_id', $ids);
    }

    /**
     * The publications in any of the states.
     *
     * @param  Builder<self>  $query
     * @param  list<PublicationStatus>  $states
     */
    #[Scope]
    protected function inAnyState(Builder $query, array $states): void
    {
        $query->whereIn('status', array_map(fn (PublicationStatus $state) => $state->value, $states));
    }

    /**
     * The rows of any of the given open keys.
     *
     * @param  Builder<self>  $query
     * @param  array<array-key, string>|Builder<covariant Model>|Closure  $keys
     */
    #[Scope]
    protected function withAnyOpenKey(Builder $query, array|Builder|Closure $keys): void
    {
        $query->whereIn('open_key', $keys);
    }

    /**
     * The rows by created at descending.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function newestCreatedFirst(Builder $query): void
    {
        $query->orderByDesc('created_at');
    }
}
