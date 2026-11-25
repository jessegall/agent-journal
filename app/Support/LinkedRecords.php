<?php

declare(strict_types=1);

namespace App\Support;

use App\Models\Records\Link;
use Illuminate\Database\Eloquent\Builder;

/**
 * Narrows a query of records the caller may read to those linked, in either direction, to one record.
 */
final readonly class LinkedRecords
{
    /**
     * @template TBuilder of Builder<*>
     *
     * @param  TBuilder  $records
     * @return TBuilder
     */
    public static function narrow(Builder $records, string $type, string $id): Builder
    {
        $other = $records->getModel();
        $key = $other->getQualifiedKeyName();
        $otherType = $other->getMorphClass();
        $asTargets = Link::query()->withSourceKey($type, $id)->toTargetType($otherType)->targetIds();
        $asSources = Link::query()->withTargetKey($type, $id)->fromSourceType($otherType)->sourceIds();

        return $records->where(fn (Builder $linked) => $linked->whereIn($key, $asTargets)->orWhereIn($key, $asSources));
    }
}
