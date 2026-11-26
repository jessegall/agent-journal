<?php

declare(strict_types=1);

namespace App\Models\Skills;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Skills\SkillContextEpochAdvanced;
use App\Models\Support\JournalModel;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * Which context of a session is current: it moves on at every clear and compaction, so a skill read in an earlier
 * context counts as unread again.
 *
 * @property string $id
 * @property string $session_id
 * @property int $epoch
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class SkillContextEpoch extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'epoch' => 'integer',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The session's epoch row, made at epoch 0 the first time and locked for the transaction.
     */
    public static function create(string $sessionId): self
    {
        $epoch = new self();
        $epoch->session_id = $sessionId;
        $epoch->epoch = 0;
        $epoch->setAttribute($epoch->getKeyName(), $epoch->newUniqueId());
        $epoch->insertIfAbsent();

        return self::query()->ofSession($sessionId)->lockForUpdate()->firstOrFail();
    }

    // ----------[ Mutations ]----------

    /**
     * Starts the session's next context after a clear or compaction.
     */
    public function advance(): void
    {
        $this->epoch++;
        $this->assertSaved($this->save());
        $this->raise(new SkillContextEpochAdvanced($this->id));
    }

    // ----------[ Queries ]----------

    /**
     * The session's current context epoch; 0 until its first clear or compaction.
     */
    public static function resolveCurrentOf(string $sessionId): int
    {
        return self::query()->ofSession($sessionId)->first()->epoch ?? 0;
    }

    // ----------[ Scopes ]----------

    /**
     * The session's epoch.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofSession(Builder $query, string $sessionId): void
    {
        $query->where('session_id', $sessionId);
    }
}
