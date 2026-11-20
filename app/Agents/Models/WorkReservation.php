<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Values\WorkReference;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * Certified work that must be reviewed, holding its actor and checkout until the review chain releases it: no other
 * job may take that actor or checkout, and cleanup keeps the checkout. It is retained with the certificate, in the
 * same transaction, so no handoff that is lost later can leave the work unreserved.
 *
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $checkout
 * @property string $work
 * @property int $generation
 * @property string $certificate
 * @property Carbon|null $released_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Table('work_reservations')]
#[Fillable(['actor_type', 'actor_id', 'checkout', 'work', 'generation', 'certificate', 'released_at'])]
final class WorkReservation extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['generation' => 'integer', 'released_at' => 'datetime'];
    }

    /**
     * Reserves the actor and checkout of certified work, once per certificate.
     */
    public static function retain(
        ActorIdentity $actor,
        string $checkout,
        WorkReference $work,
        int $generation,
        string $certificate,
    ): self {
        return self::query()->firstOrCreate(['certificate' => $certificate], [
            ...$actor->asColumns('actor'),
            'checkout' => $checkout,
            'work' => $work->key,
            'generation' => $generation,
        ]);
    }

    /**
     * Which of these agents certified work still holds for review.
     *
     * @param  list<string>  $agentIds
     * @return list<string>
     */
    public static function reservedAgentIds(array $agentIds): array
    {
        if ($agentIds === []) {
            return [];
        }

        return array_values(self::query()
            ->where('actor_type', ActorType::Agent->value)
            ->whereIn('actor_id', $agentIds)
            ->whereNull('released_at')
            ->readLimit(count($agentIds))
            ->distinct()
            ->pluck('actor_id')
            ->map(fn (mixed $agentId): string => (string) $agentId)
            ->all());
    }

    public static function holds(ActorIdentity $actor): bool
    {
        return self::query()
            ->where('actor_type', $actor->type->value)
            ->where('actor_id', $actor->id)
            ->whereNull('released_at')
            ->exists();
    }
}
