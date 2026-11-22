<?php

declare(strict_types=1);

namespace App\Casts;

use App\Data\FieldOriginData;
use App\Exceptions\ProfileRevisionUnreadable;
use App\Support\Stored\StoredAccessPolicy;
use App\Support\Stored\StoredExecutionPolicy;
use App\Support\Stored\StoredStopConditions;
use App\Values\FieldOrigin;
use App\Values\ProfileProvenance;
use App\Values\ProfileStartPolicy;
use Exception;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use JsonException;
use TypeError;
use ValueError;

/**
 * Stores a revision's start policy in its own columns (driver, whether it is pinned, allowed models, the policies,
 * the configuration hash and provenance) and rebuilds it through the policies' own checks when read. A column that no
 * longer reads fails the read rather than stand in for a default.
 *
 * @implements CastsAttributes<ProfileStartPolicy, ProfileStartPolicy>
 */
final class ProfileStartPolicyCast implements CastsAttributes
{
    /**
     * @param  array<string, mixed>  $attributes
     *
     * @throws ProfileRevisionUnreadable
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): ProfileStartPolicy
    {
        try {
            return new ProfileStartPolicy(
                $attributes['driver'] === null ? null : (string) $attributes['driver'],
                (bool) $attributes['driver_pinned'],
                self::models((string) $attributes['allowed_models']),
                StoredAccessPolicy::from((string) $attributes['access_policy'])->toAccessPolicy(),
                StoredStopConditions::from((string) $attributes['stop_conditions'])->toStopConditions(),
                StoredExecutionPolicy::from((string) $attributes['execution_policy'])->toExecutionPolicy(),
                new ProfileProvenance(
                    (string) $attributes['configuration_hash'],
                    self::origins((string) $attributes['provenance']),
                ),
            );
        } catch (Exception|TypeError|ValueError $failure) {
            throw ProfileRevisionUnreadable::forRevision((string) $model->getKey(), $failure);
        }
    }

    /**
     * @param  ProfileStartPolicy  $value
     * @param  array<string, mixed>  $attributes
     * @return array<string, string|bool|null>
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): array
    {
        return [
            'driver' => $value->driver,
            'driver_pinned' => $value->driverPinned,
            'allowed_models' => json_encode($value->allowedModels, JSON_THROW_ON_ERROR),
            'access_policy' => StoredAccessPolicy::fromAccessPolicy($value->access)->toJson(),
            'stop_conditions' => StoredStopConditions::fromStopConditions($value->stopConditions)->toJson(),
            'execution_policy' => StoredExecutionPolicy::fromExecutionPolicy($value->execution)->toJson(),
            'configuration_hash' => $value->provenance->configurationHash,
            'provenance' => json_encode(
                array_map(FieldOriginData::fromFieldOrigin(...), $value->provenance->origins),
                JSON_THROW_ON_ERROR,
            ),
        ];
    }

    /**
     * The allowed models a column lists; any entry that is no model name fails the read.
     *
     * @return list<string>
     *
     * @throws JsonException
     */
    private static function models(string $column): array
    {
        return array_values(self::decodedList($column)->map(fn (string $model): string => $model)->all());
    }

    /**
     * Where each effective field came from, as the provenance column lists it.
     *
     * @return list<FieldOrigin>
     *
     * @throws JsonException
     */
    private static function origins(string $column): array
    {
        return array_values(FieldOriginData::collect(self::decodedList($column))
            ->map(fn (FieldOriginData $origin): FieldOrigin => $origin->toFieldOrigin())
            ->all());
    }

    /**
     * The list a JSON column holds; a value that is no list fails where its entries are read.
     *
     * @return Collection<int, mixed>
     *
     * @throws JsonException
     */
    private static function decodedList(string $column): Collection
    {
        return Collection::fromJson($column, 16, JSON_THROW_ON_ERROR);
    }
}
