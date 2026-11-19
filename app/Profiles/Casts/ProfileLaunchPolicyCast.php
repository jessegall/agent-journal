<?php

declare(strict_types=1);

namespace App\Profiles\Casts;

use App\Agents\Stored\StoredAccessPolicy;
use App\Agents\Stored\StoredExecutionPolicy;
use App\Agents\Stored\StoredStopConditions;
use App\Profiles\Enums\PolicyOriginType;
use App\Profiles\Exceptions\ProfileRevisionUnreadable;
use App\Profiles\Values\FieldOrigin;
use App\Profiles\Values\ProfileLaunchPolicy;
use App\Profiles\Values\ProfileProvenance;
use App\Programs\Enums\HookProgram;
use Exception;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use JsonException;
use TypeError;
use ValueError;

/**
 * Stores a revision's launch policy in its own columns (program, whether it is pinned, allowed models, the policies,
 * the configuration hash and provenance) and rebuilds it through the policies' own checks when read. A column that no
 * longer reads fails the read rather than stand in for a default.
 *
 * @implements CastsAttributes<ProfileLaunchPolicy, ProfileLaunchPolicy>
 */
final class ProfileLaunchPolicyCast implements CastsAttributes
{
    /**
     * @param  array<string, mixed>  $attributes
     *
     * @throws ProfileRevisionUnreadable
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): ProfileLaunchPolicy
    {
        try {
            return new ProfileLaunchPolicy(
                HookProgram::tryFrom((string) $attributes['program']),
                (bool) $attributes['program_pinned'],
                self::decode($attributes['allowed_models']),
                StoredAccessPolicy::from(self::decode($attributes['access_policy']))->toAccessPolicy(),
                StoredStopConditions::from(self::decode($attributes['stop_conditions']))->toStopConditions(),
                StoredExecutionPolicy::from(self::decode($attributes['execution_policy']))->toExecutionPolicy(),
                self::provenance((string) $attributes['configuration_hash'], self::decode($attributes['provenance'])),
            );
        } catch (Exception|TypeError|ValueError $failure) {
            throw ProfileRevisionUnreadable::forRevision((string) $model->getKey(), $failure);
        }
    }

    /**
     * @param  ProfileLaunchPolicy  $value
     * @param  array<string, mixed>  $attributes
     * @return array<string, string|bool|null>
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): array
    {
        return [
            'program' => $value->program?->value,
            'program_pinned' => $value->programPinned,
            'allowed_models' => self::encode($value->allowedModels),
            'access_policy' => self::encode(StoredAccessPolicy::fromAccessPolicy($value->access)->toArray()),
            'stop_conditions' => self::encode(StoredStopConditions::fromStopConditions($value->stopConditions)->toArray()),
            'execution_policy' => self::encode(StoredExecutionPolicy::fromExecutionPolicy($value->execution)->toArray()),
            'configuration_hash' => $value->provenance->configurationHash,
            'provenance' => self::encode(array_map(
                fn (FieldOrigin $origin) => ['field' => $origin->field, 'origin' => $origin->origin->value],
                $value->provenance->origins,
            )),
        ];
    }

    /**
     * @param  list<array{field: string, origin: string}>  $origins
     */
    private static function provenance(string $configurationHash, array $origins): ProfileProvenance
    {
        return new ProfileProvenance($configurationHash, array_map(
            fn (array $origin) => new FieldOrigin($origin['field'], PolicyOriginType::from($origin['origin'])),
            $origins,
        ));
    }

    /**
     * The column's JSON; a value that is no object or list fails where it is used as one.
     *
     * @throws JsonException
     */
    private static function decode(mixed $column): mixed
    {
        return json_decode((string) $column, true, 16, JSON_THROW_ON_ERROR);
    }

    /**
     * @param  array<array-key, mixed>  $value
     */
    private static function encode(array $value): string
    {
        return json_encode($value, JSON_THROW_ON_ERROR);
    }
}
