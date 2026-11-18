<?php

declare(strict_types=1);

namespace App\Skills\Models;

use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * Which context of a session is current: it moves on at every clear and compaction, so a skill read in an earlier
 * context counts as unread again.
 *
 * @property string $id
 * @property string $session_id
 * @property int $epoch
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['session_id', 'epoch'])]
final class SkillContextEpoch extends Model implements ReadableModel
{
    use BoundedReads, HasUlids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'epoch' => 'integer',
        ];
    }

    /**
     * The session's current context epoch; 0 until its first clear or compaction.
     */
    public static function currentOf(string $sessionId): int
    {
        return self::query()->where('session_id', $sessionId)->first()?->epoch ?? 0;
    }

    /**
     * Starts the session's next context after a clear or compaction.
     */
    public static function advance(string $sessionId): void
    {
        $current = self::query()->where('session_id', $sessionId)->lockForUpdate()->first();

        if ($current === null) {
            self::query()->create(['session_id' => $sessionId, 'epoch' => 1]);

            return;
        }

        $current->epoch++;
        $current->save();
    }
}
