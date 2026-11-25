<?php

declare(strict_types=1);

namespace App\Models\Reviews;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\ActorType;
use App\Events\Reviews\WorkReservationHandedOff;
use App\Events\Reviews\WorkReservationReleased;
use App\Models\Support\HasActorColumns;
use App\Support\ActorIdentity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property int $generation
 * @property string $certificate
 * @property ?Carbon $handed_off_at
 * @property ?Carbon $released_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property CertifiedWork $certifiedWork
 */
#[Table('work_reservations')]
#[Fillable([
    'actor_type',
    'actor_id',
    'generation',
    'certificate',
    'handed_off_at',
    'released_at',
])]
final class WorkReservation extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasActorColumns;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'generation' => 'integer',
            'handed_off_at' => 'datetime',
            'released_at' => 'datetime',
        ];
    }

    // ----------[ Mutations ]----------

    /**
     * Marks the review of this work open, so the handoff runs no more.
     */
    public function handOff(): void
    {
        if ($this->handed_off_at !== null) {
            return;
        }

        $this->handed_off_at = Carbon::now();
        $this->assertSaved($this->save());
        $this->raise(new WorkReservationHandedOff($this->id));
    }

    /**
     * Ends the reservation when the work's chain ends, so its actor and checkout go back to normal cleanup.
     */
    public function release(): void
    {
        if ($this->released_at !== null) {
            return;
        }

        $this->released_at = Carbon::now();
        $this->assertSaved($this->save());
        $this->raise(new WorkReservationReleased($this->id));
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<CertifiedWork, $this>
     */
    public function certifiedWork(): BelongsTo
    {
        return $this->belongsTo(CertifiedWork::class, 'certificate', 'certificate');
    }

    // ----------[ Queries ]----------

    /**
     * Reserves the actor and checkout of certified work, once per certificate.
     */
    public static function retain(CertifiedWork $work, ActorIdentity $actor, int $generation): self
    {
        $reservation = new self([
            'certificate' => $work->certificate,
            'actor_type' => $actor->type->value,
            'actor_id' => $actor->id,
            'generation' => $generation,
        ]);

        $reservation->setAttribute($reservation->getKeyName(), $reservation->newUniqueId());
        $reservation->insertIfAbsent();

        return self::query()->withCertificate($work->certificate)->sole();
    }

    /**
     * Reserved work whose review is not open yet, the one tried longest ago first, so a failing import never holds
     * back the others.
     *
     * @return list<self>
     */
    public static function awaitingHandoff(int $limit): array
    {
        return array_values(self::query()
            ->notHandedOff()
            ->unreleased()
            ->leastRecentlyUpdatedFirst()
            ->readExactly($limit)
            ->get()
            ->all());
    }

    public static function lockedFor(string $certificate): self
    {
        return self::query()->with('certifiedWork')->withCertificate($certificate)->lockForUpdate()->firstOrFail();
    }

    /**
     * Which of these agents certified work still holds for review.
     *
     * @param  list<string>  $ids
     * @return list<string>
     */
    public static function reservedAgentIds(array $ids): array
    {
        if ($ids === []) {
            return [];
        }

        return array_values(array_unique(self::query()
            ->heldByAgents($ids)
            ->unreleased()
            ->readAll('the open reservations of these agents, a few at most for each')
            ->pluck('actor_id')
            ->map(fn (mixed $agentId): string => (string) $agentId)
            ->all()));
    }

    public static function holds(ActorIdentity $actor): bool
    {
        return self::query()
            ->heldBy($actor)
            ->unreleased()
            ->exists();
    }

    // ----------[ Scopes ]----------

    /**
     * The reservation of the certified work.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withCertificate(Builder $query, string $certificate): void
    {
        $query->where('certificate', $certificate);
    }

    /**
     * The reservations not handed off yet.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function notHandedOff(Builder $query): void
    {
        $query->whereNull('handed_off_at');
    }

    /**
     * The reservations still held.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unreleased(Builder $query): void
    {
        $query->whereNull('released_at');
    }

    /**
     * The reservations updated longest ago first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function leastRecentlyUpdatedFirst(Builder $query): void
    {
        $query->orderBy('updated_at');
    }

    /**
     * The reservations of the agents.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $ids
     */
    #[Scope]
    protected function heldByAgents(Builder $query, array $ids): void
    {
        $query->where('actor_type', ActorType::Agent->value)->whereIn('actor_id', $ids);
    }

    /**
     * The actor's reservations.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function heldBy(Builder $query, ActorIdentity $actor): void
    {
        $query->where('actor_type', $actor->type->value)->where('actor_id', $actor->id);
    }
}
