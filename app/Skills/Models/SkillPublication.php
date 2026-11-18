<?php

declare(strict_types=1);

namespace App\Skills\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Models\AgentSession;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Skills\Enums\PublicationState;
use App\Skills\Exceptions\SkillPublicationFailed;
use App\Skills\Exceptions\SkillPublicationMissing;
use App\Skills\Exceptions\SkillPublicationStale;
use App\Skills\Values\PublicationStatus;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
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
 * @property string $program
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
    'program',
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
final class SkillPublication extends Model implements ReadableModel
{
    use BoundedReads, HasUlids, Linkable;

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

    /**
     * Records the intent to deliver this selection to the session's target; an open intent for the same target is
     * superseded, so one target has one open intent.
     *
     * @param  list<string>  $skillKeys  the keys of the selected skills, in the generation's order
     */
    public static function intend(
        string $sessionId,
        string $program,
        string $target,
        SkillGeneration $generation,
        string $selectionDigest,
        array $skillKeys,
    ): self
    {
        $openKey = self::openKeyOf($sessionId, $target);
        $earlier = self::query()->where('open_key', $openKey)->lockForUpdate()->first();
        $earlier?->supersede();
        $delivered = self::query()
            ->forTarget($sessionId, $target)
            ->inState(PublicationState::Delivered)
            ->orderByDesc('created_at')
            ->first();

        return self::query()->create([
            'session_id' => $sessionId,
            'program' => $program,
            'target' => $target,
            'generation_id' => $generation->id,
            'selection_digest' => $selectionDigest,
            'skill_keys' => $skillKeys,
            'expected_previous_generation_id' => $delivered?->generation_id,
            'state' => PublicationState::Pending,
            'open_key' => $openKey,
        ]);
    }

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

        return $this->fencing_version;
    }

    /**
     * @throws SkillPublicationStale when a newer worker holds it
     */
    public function recordProgress(int $fence, int $filesStaged): void
    {
        $this->checkFence($fence);
        $this->progress = $filesStaged;
        $this->save();
    }

    /**
     * @param  array<string, mixed>  $manifest
     *
     * @throws SkillPublicationStale when a newer worker holds it
     */
    public function deliver(int $fence, array $manifest): void
    {
        $this->checkFence($fence);
        $this->moveTo(PublicationState::Delivered);
        $this->manifest = $manifest;
        $this->open_key = null;
        $this->lease_holder = null;
        $this->lease_until = null;
        $this->save();
        self::query()
            ->forTarget($this->session_id, $this->target)
            ->inState(PublicationState::Delivered)
            ->whereKeyNot($this->id)
            ->readAll('a target keeps a handful of delivered publications')
            ->get()
            ->each(fn (self $older) => $older->supersede());
    }

    public function fail(string $reason): void
    {
        $this->moveTo(PublicationState::Failed);
        $this->error = $reason;
        $this->open_key = null;
        $this->lease_holder = null;
        $this->lease_until = null;
        $this->save();
    }

    /**
     * A failed publication waits again for a worker, with the same immutable generation; once the target has a newer
     * publication, only a refresh makes a new one.
     */
    public function retry(): void
    {
        $newer = self::query()
            ->forTarget($this->session_id, $this->target)
            ->where('created_at', '>', $this->created_at)
            ->exists();

        if ($newer) {
            throw SkillPublicationFailed::newerExists($this->id);
        }

        $this->moveTo(PublicationState::Pending);
        $this->error = null;
        $this->open_key = self::openKeyOf($this->session_id, $this->target);
        $this->save();
    }

    public function supersede(): void
    {
        $this->moveTo(PublicationState::Superseded);
        $this->open_key = null;
        $this->save();
    }

    public function retire(): void
    {
        $this->moveTo(PublicationState::Retired);
        $this->save();
    }

    /**
     * The immutable generation this publication delivers.
     */
    public function generation(): SkillGeneration
    {
        return SkillGeneration::query()->whereKey($this->generation_id)->firstOrFail();
    }

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
     * Whether the target's newest open or delivered publication already carries this selection.
     */
    public static function hasSelection(string $sessionId, string $target, string $selectionDigest): bool
    {
        $latest = self::query()
            ->forTarget($sessionId, $target)
            ->whereIn('state', [
                PublicationState::Pending->value,
                PublicationState::Preparing->value,
                PublicationState::Delivered->value,
            ])
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->first();

        return $latest !== null && $latest->selection_digest === $selectionDigest;
    }

    /**
     * @throws SkillPublicationMissing
     */
    public static function lockById(string $publicationId): self
    {
        return self::query()->whereKey($publicationId)->lockForUpdate()->first()
            ?? throw SkillPublicationMissing::for($publicationId);
    }

    /**
     * Every publication no worker will touch again and not yet retired, newest first, for the daily prune.
     *
     * @return list<self>
     */
    public static function settled(int $limit): array
    {
        $settled = self::query()
            ->whereIn('state', [
                PublicationState::Delivered->value,
                PublicationState::Failed->value,
                PublicationState::Superseded->value,
            ])
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->readLimit($limit)
            ->get();

        return array_values($settled->all());
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

    /**
     * The one name of its session's target, so publications of one target are counted together.
     */
    public function targetName(): string
    {
        return self::openKeyOf($this->session_id, $this->target);
    }

    /**
     * Every publication still waiting for a worker, oldest first.
     *
     * @return list<self>
     */
    public static function open(int $limit): array
    {
        $open = self::query()
            ->whereIn('state', [PublicationState::Pending->value, PublicationState::Preparing->value])
            ->orderBy('created_at')
            ->readLimit($limit)
            ->get();

        return array_values($open->all());
    }

    /**
     * The newest publication of each of these sessions, for status; an agent passes only its own session.
     *
     * @param  list<string>  $sessionIds
     * @return list<self>
     */
    public static function latestOfSessions(array $sessionIds, int $limit): array
    {
        $latest = self::query()
            ->whereIn('session_id', $sessionIds)
            ->orderByDesc('created_at')
            ->readLimit($limit)
            ->get()
            ->unique('session_id');

        return array_values($latest->all());
    }

    /**
     * Where each of these publications stands, by id; an id that names none is left out.
     *
     * @param  list<string>  $publicationIds
     * @return array<string, PublicationState>
     */
    public static function statesOf(array $publicationIds): array
    {
        $publications = self::query()->whereKey($publicationIds)->readLimit(max(1, count($publicationIds)))->get();

        return $publications->mapWithKeys(fn (self $publication) => [$publication->id => $publication->state])->all();
    }

    /**
     * The session's first publication: the set its program was launched with, which a program that loads skills only
     * at a new session keeps.
     */
    public static function firstOfSession(string $sessionId): self
    {
        return self::query()
            ->where('session_id', $sessionId)
            ->orderBy('created_at')
            ->orderBy('id')
            ->firstOrFail();
    }

    /**
     * The session's newest publication, or null when none was asked for it.
     */
    public static function latestOfSession(string $sessionId): self|null
    {
        return self::query()
            ->where('session_id', $sessionId)
            ->orderByDesc('created_at')
            ->orderByDesc('id')
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
            ->orderByDesc('created_at')
            ->readLimit($limit)
            ->get()
            ->unique('session_id');

        return array_values($latest->all());
    }

    public function status(): PublicationStatus
    {
        return new PublicationStatus(
            $this->id,
            $this->session_id,
            $this->state,
            $this->generation_id,
            $this->selection_digest,
            $this->target,
            $this->error,
        );
    }

    /**
     * Whether the actor may read this publication: a user reads every one, an agent only those of its own sessions.
     */
    public function isReadableBy(ActorIdentity $actor): bool
    {
        if ($actor->type === ActorType::User) {
            return true;
        }

        return AgentSession::query()->whereKey($this->session_id)->where('agent_id', $actor->id)->exists();
    }

    /**
     * @throws SkillPublicationFailed
     */
    private function moveTo(PublicationState $next): void
    {
        if (! $this->state->canMoveTo($next)) {
            throw SkillPublicationFailed::transition($this->state, $next);
        }

        $this->state = $next;
    }

    /**
     * @throws SkillPublicationStale when a newer worker holds it
     */
    private function checkFence(int $fence): void
    {
        if (! $this->isHeldBy($fence)) {
            throw SkillPublicationStale::for($fence, $this->fencing_version);
        }
    }

    private static function openKeyOf(string $sessionId, string $target): string
    {
        return $sessionId.'|'.$target;
    }

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
}
