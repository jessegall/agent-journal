<?php

declare(strict_types=1);

namespace Domain\Memory\Models;

use App\Agents\Support\StackTarget;
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
 * @property string $agent_id
 * @property string $session_id
 * @property string $compaction_id
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
#[Fillable(['agent_id', 'session_id', 'compaction_id'])]
final class MemoryCompaction extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids, Linkable;

    /**
     * Records the compaction the first time it is seen; answers whether this was the first time.
     */
    public static function recordOnce(StackTarget $target, string $compactionId): bool
    {
        $now = CarbonImmutable::now();

        return self::query()->insertOrIgnore([
            'id' => (new self)->newUniqueId(),
            'agent_id' => $target->agentId,
            'session_id' => $target->sessionId,
            'compaction_id' => $compactionId,
            'created_at' => $now,
            'updated_at' => $now,
        ]) === 1;
    }
}
