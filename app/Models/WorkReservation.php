<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Contracts\ReadableModel;
use App\Enums\ActorType;
use App\Models\Support\HasActorColumns;
use App\Support\ActorIdentity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Certified work that must be reviewed, holding its actor and checkout until the review chain releases it: no other
 * job may take that actor or checkout, and cleanup keeps the checkout. It is retained with the certificate, in the
 * same transaction, so a handoff that is lost later can never leave the work unreserved; it is handed off once its
 * review is open.
 *
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property int $generation
 * @property string $certificate
 * @property Carbon|null $handed_off_at
 * @property Carbon|null $released_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read CertifiedWork $certifiedWork
 */
#[Table('work_reservations')]
#[Fillable(['actor_type', 'actor_id', 'generation', 'certificate', 'handed_off_at', 'released_at'])]
final class WorkReservation extends Model implements ReadableModel
{
    use BoundedReads;
    use HasActorColumns;
    use HasUlids;
    use InsertsAbsentRows;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['generation' => 'integer', 'handed_off_at' => 'datetime', 'released_at' => 'datetime'];
    }

    // ----------[ Queries ]----------

    /**
     * Reserves the actor and checkout of certified work, once per certificate.
     */
    public static function retain(CertifiedWork $work, ActorIdentity $actor, int $generation): self
    {
        $reservation = new self([
            'certificate' => $work->certificate,
            ...$actor->asColumns('actor'),
            'generation' => $generation,
        ]);

        $reservation->setAttribute($reservation->getKeyName(), $reservation->newUniqueId());
        $reservation->insertIfAbsent();

        return self::query()->where('certificate', $work->certificate)->sole();
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
            ->whereNull('handed_off_at')
            ->whereNull('released_at')
            ->orderBy('updated_at')
            ->readExactly($limit)
            ->get()
            ->all());
    }

    public static function lockedFor(string $certificate): self
    {
        return self::query()->with('certifiedWork')->where('certificate', $certificate)->lockForUpdate()->firstOrFail();
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
            ->where('actor_type', ActorType::Agent->value)
            ->whereIn('actor_id', $ids)
            ->whereNull('released_at')
            ->readAll('the open reservations of these agents, a few at most for each')
            ->pluck('actor_id')
            ->map(fn (mixed $agentId): string => (string) $agentId)
            ->all()));
    }

    public static function holds(ActorIdentity $actor): bool
    {
        return self::query()
            ->where('actor_type', $actor->type->value)
            ->where('actor_id', $actor->id)
            ->whereNull('released_at')
            ->exists();
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
        $this->save();
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
        $this->save();
    }

    // ----------[ Answers ]----------

    /**
     * @return BelongsTo<CertifiedWork, $this>
     */
    public function certifiedWork(): BelongsTo
    {
        return $this->belongsTo(CertifiedWork::class, 'certificate', 'certificate');
    }
}
