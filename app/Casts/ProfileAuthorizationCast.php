<?php

declare(strict_types=1);

namespace App\Casts;

use App\Attributes\DecodesAnyJson;
use App\Contracts\Command;
use App\Data\StoredPolicyGrant;
use App\Data\StoredScopedRead;
use App\Enums\AuthorizationType;
use App\Exceptions\GrantShapeInvalid;
use App\Exceptions\ProfileRevisionUnreadable;
use App\Values\ProfileAuthorization;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use JsonException;
use Spatie\LaravelData\Exceptions\CannotCreateData;
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
            return new ProfileAuthorization(
                AuthorizationType::from((string) $attributes['authorization_type']),
                array_values(array_map(
                    fn (StoredPolicyGrant $stored) => $stored->grant,
                    StoredPolicyGrant::collect(
                        json_decode((string) $attributes['policy_grants'], true, 8, JSON_THROW_ON_ERROR),
                    ),
                )),
                self::deniedCommandsOf((string) $attributes['denied_commands']),
                array_values(array_map(
                    fn (StoredScopedRead $stored) => $stored->read(),
                    StoredScopedRead::collect(
                        json_decode((string) $attributes['read_grants'], true, 4, JSON_THROW_ON_ERROR),
                    ),
                )),
            );
        } catch (JsonException|CannotCreateData|TypeError|ValueError|GrantShapeInvalid $failure) {
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
            'policy_grants' => json_encode($value->grantsAsArrays(), JSON_THROW_ON_ERROR),
            'denied_commands' => json_encode($value->deniedCommands, JSON_THROW_ON_ERROR),
            'read_grants' => json_encode($value->readsAsArrays(), JSON_THROW_ON_ERROR),
        ];
    }

    /**
     * The denied commands column: a bare JSON list of command classes, with no keys for a Data class to name.
     *
     * @return list<class-string<Command<mixed>>>
     *
     * @throws JsonException
     */
    #[DecodesAnyJson]
    private static function deniedCommandsOf(string $json): array
    {
        return array_values((array) json_decode($json, true, 4, JSON_THROW_ON_ERROR));
    }
}
