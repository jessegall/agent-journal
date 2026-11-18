<?php

declare(strict_types=1);

namespace Domain\Memory\Models;

use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One compaction of one agent's session that has already lowered the agent's memories, so a repeated callback for the
 * same compaction changes nothing.
 *
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $compaction_key the id the agent program gave the compaction, not a row reference
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
#[Fillable(['actor_type', 'actor_id', 'compaction_key'])]
final class MemoryCompaction extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids, Linkable;

    /**
     * Records the compaction the first time it is seen; answers whether this was the first time.
     */
    public static function recordOnce(ActorIdentity $actor, string $compactionId): bool
    {
        $now = CarbonImmutable::now();

        return self::query()->insertOrIgnore([
            'id' => (new self)->newUniqueId(),
            'actor_type' => $actor->type->value,
            'actor_id' => $actor->id,
            'compaction_key' => $compactionId,
            'created_at' => $now,
            'updated_at' => $now,
        ]) === 1;
    }
}
