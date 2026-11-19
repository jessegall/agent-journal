<?php

declare(strict_types=1);

namespace App\Profiles\Casts;

use App\Profiles\Enums\AuthorizationType;
use App\Profiles\Exceptions\ProfileRevisionUnreadable;
use App\Profiles\Values\AbilityGrant;
use App\Profiles\Values\ProfileAuthorization;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use JsonException;
use TypeError;
use ValueError;

/**
 * A profile revision's authorization, kept as its strategy and its list of granted policy abilities.
 *
 * @implements CastsAttributes<ProfileAuthorization, ProfileAuthorization>
 */
final class ProfileAuthorizationCast implements CastsAttributes
{
    /**
     * @param  array<string, mixed>  $attributes
     *
     * @throws ProfileRevisionUnreadable
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): ProfileAuthorization
    {
        try {
            $grants = json_decode((string) $attributes['ability_grants'], true, 8, JSON_THROW_ON_ERROR);

            return new ProfileAuthorization(
                AuthorizationType::from((string) $attributes['authorization_type']),
                array_values(array_map(AbilityGrant::fromArray(...), $grants)),
            );
        } catch (JsonException|TypeError|ValueError $failure) {
            throw ProfileRevisionUnreadable::forRevision((string) $model->getKey(), $failure);
        }
    }

    /**
     * @param  ProfileAuthorization  $value
     * @param  array<string, mixed>  $attributes
     * @return array<string, string>
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): array
    {
        return [
            'authorization_type' => $value->type->value,
            'ability_grants' => json_encode($value->grantsAsArrays(), JSON_THROW_ON_ERROR),
        ];
    }
}
