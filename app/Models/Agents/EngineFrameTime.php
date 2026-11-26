<?php

declare(strict_types=1);

namespace App\Models\Agents;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property string $id
 * @property string $frame_id
 * @property string $stack_id
 * @property CarbonImmutable $settled_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class EngineFrameTime extends JournalModel implements ReadableModel
{
    use BoundedReads;
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
    public static function resolveSettledAtFor(array $ids): array
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
