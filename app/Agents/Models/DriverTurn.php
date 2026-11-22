<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One native turn of a runtime's driver: keyed by its process generation and the driver's own prompt id
 * (Claude Code prompt_id, Codex turn_id), with the settings it ran with and how it ended.
 *
 * @property string $id
 * @property string $agent_runtime_id
 * @property int $process_generation
 * @property string $native_prompt_id
 * @property string|null $observed_model
 * @property string|null $observed_effort
 * @property string|null $outcome
 * @property CarbonImmutable $started_at
 * @property CarbonImmutable|null $finished_at
 */
#[Fillable(
    ['agent_runtime_id', 'process_generation', 'native_prompt_id', 'observed_model', 'observed_effort', 'started_at'],
)]
final class DriverTurn extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'started_at' => 'immutable_datetime',
            'finished_at' => 'immutable_datetime',
        ];
    }

    /**
     * The turn of this native prompt in this process generation, recorded the first time it is seen; a repeated
     * report finds the same turn. The caller's transaction holds the runtime's lock, so two reports never race.
     */
    public static function recordStart(
        string $runtimeId,
        int $processGeneration,
        string $nativePromptId,
        CarbonImmutable $startedAt,
    ): self {
        $key = [
            'agent_runtime_id' => $runtimeId,
            'process_generation' => $processGeneration,
            'native_prompt_id' => $nativePromptId,
        ];

        return self::query()->where($key)->first() ?? self::query()->create([...$key, 'started_at' => $startedAt]);
    }

    // ----------[ Mutations ]----------

    public function finish(string $outcome, CarbonImmutable $at): void
    {
        $this->outcome = $outcome;
        $this->finished_at = $at;
        $this->save();
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<AgentRuntime, $this>
     */
    public function runtime(): BelongsTo
    {
        return $this->belongsTo(AgentRuntime::class, 'agent_runtime_id');
    }
}
