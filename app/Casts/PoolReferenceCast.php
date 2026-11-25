<?php

declare(strict_types=1);

namespace App\Casts;

use App\Data\Assignments\StoredPoolData;
use App\Exceptions\AutoAssignmentPoolUnreadable;
use App\Support\PoolReference;
use ErrorException;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use InvalidArgumentException;
use JsonException;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use TypeError;

/**
 * Reads the JSON pool column of an auto-assignment as a PoolReference and writes it back; a column that does not
 * read as one fails, so a damaged row never stands in for another pool.
 *
 * @implements CastsAttributes<PoolReference, PoolReference>
 */
final class PoolReferenceCast implements CastsAttributes
{
    /**
     * @param  array<string, mixed>  $attributes
     *
     * @throws AutoAssignmentPoolUnreadable
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): PoolReference
    {
        try {
            return StoredPoolData::from(json_decode((string) $value, true, 4, JSON_THROW_ON_ERROR))->pool();
        } catch (JsonException|CannotCreateData|InvalidArgumentException|TypeError|ErrorException $failure) {
            throw AutoAssignmentPoolUnreadable::forRow((string) $model->getKey(), $failure);
        }
    }

    /**
     * @param  PoolReference  $value
     * @param  array<string, mixed>  $attributes
     * @return array<string, string>
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): array
    {
        $target = $value->target === null ? null : [
            'type' => $value->target->type,
            'id' => $value->target->id,
        ];
        $pool = ['type' => $value->type, 'target' => $target, 'record_ids' => $value->recordIds];

        return [$key => json_encode($pool, JSON_THROW_ON_ERROR)];
    }
}
