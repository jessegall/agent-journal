<?php

declare(strict_types=1);

namespace App\Sharing\Casts;

use App\Sharing\Data\StoredSelectedTargetData;
use App\Sharing\Exceptions\StoredShareColumnInvalid;
use App\Sharing\Support\ShareSelectedTarget;
use Error;
use ErrorException;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use InvalidArgumentException;
use JsonException;
use Spatie\LaravelData\Exceptions\CannotCreateData;

/**
 * Reads the JSON selection column of a preview as its list of selected targets and writes it back, each target as
 * its record type and id, link id and publication version.
 *
 * @implements CastsAttributes<list<ShareSelectedTarget>, list<ShareSelectedTarget>>
 */
final class SelectedTargetsCast implements CastsAttributes
{
    /**
     * @param  array<string, mixed>  $attributes
     * @return list<ShareSelectedTarget>
     *
     * @throws StoredShareColumnInvalid
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): array
    {
        try {
            return array_values(array_map(
                fn (StoredSelectedTargetData $target) => $target->target(),
                StoredSelectedTargetData::collect(json_decode((string) $value, true, 3, JSON_THROW_ON_ERROR)),
            ));
        } catch (JsonException|CannotCreateData|InvalidArgumentException|ErrorException|Error $failure) {
            throw StoredShareColumnInvalid::for($model->getTable(), $key, (string) $model->getKey(), $failure);
        }
    }

    /**
     * @param  list<ShareSelectedTarget>  $value
     * @param  array<string, mixed>  $attributes
     * @return array<string, string>
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): array
    {
        $targets = array_map(fn (ShareSelectedTarget $target) => [
            'type' => $target->record->type,
            'id' => $target->record->id,
            'link_id' => $target->linkId,
            'publication_version' => $target->publicationVersion,
        ], $value);

        return [$key => json_encode($targets, JSON_THROW_ON_ERROR)];
    }
}
