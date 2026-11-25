<?php

declare(strict_types=1);

namespace App\Models\Agents;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $frame_id
 * @property string $stack_id
 * @property CarbonImmutable $settled_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 */
#[Fillable([
    'frame_id',
    'stack_id',
    'settled_at',
])]
final class EngineFrameTime extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'settled_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Queries ]----------

    /**
     * The settled time of each frame that has one, by frame id, in one read.
     *
     * @param  list<string>  $ids
     * @return array<string, CarbonImmutable>
     */
    public static function settledAtFor(array $ids): array
    {
        if ($ids === []) {
            return [];
        }

        return self::query()->ofFrames($ids)->readExactly(count($ids))->get()
            ->mapWithKeys(fn (self $time) => [$time->frame_id => $time->settled_at])
            ->all();
    }

    // ----------[ Scopes ]----------

    /**
     * The times of the frames.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $ids
     */
    #[Scope]
    protected function ofFrames(Builder $query, array $ids): void
    {
        $query->whereIn('frame_id', $ids);
    }
}
