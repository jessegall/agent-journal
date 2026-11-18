<?php

declare(strict_types=1);

namespace App\Engine\Models;

use App\Engine\Values\FrameSettlement;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * One frame's timing checkpoint: the server time its last settled tick started. It is timing state, not a receipt;
 * the rows go with their stack.
 *
 * @property string $id
 * @property string $frame_id
 * @property string $stack_id
 * @property CarbonImmutable $settled_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['frame_id', 'stack_id', 'settled_at'])]
final class EngineFrameTime extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'settled_at' => 'immutable_datetime',
        ];
    }

    /**
     * The settled time of each frame that has one, by frame id, in one read.
     *
     * @param  list<string>  $frameIds
     * @return array<string, CarbonImmutable>
     */
    public static function settledAtFor(array $frameIds): array
    {
        if ($frameIds === []) {
            return [];
        }

        return self::query()->whereIn('frame_id', $frameIds)->readLimit(count($frameIds))->get()
            ->mapWithKeys(fn (self $time) => [$time->frame_id => $time->settled_at])
            ->all();
    }

    /**
     * Writes every settlement in one statement, moving a frame's existing checkpoint to its new time.
     *
     * @param  list<FrameSettlement>  $settlements
     */
    public static function recordMany(array $settlements): void
    {
        self::query()->upsert(
            array_map(fn (FrameSettlement $settlement) => [
                'id' => (string) Str::ulid(),
                'frame_id' => $settlement->frameId,
                'stack_id' => $settlement->stackId,
                'settled_at' => $settlement->settledAt(),
            ], $settlements),
            ['frame_id'],
            ['stack_id', 'settled_at'],
        );
    }
}
