<?php

declare(strict_types=1);

namespace App\Casts;

use App\Exceptions\BuiltInProfileMissing;
use App\Values\ProfileBase;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * Stores the built-in profile a revision starts from by its key, and reads it back as that base's data.
 *
 * @implements CastsAttributes<ProfileBase, ProfileBase>
 */
final class ProfileBaseCast implements CastsAttributes
{
    /**
     * @param  array<string, mixed>  $attributes
     *
     * @throws BuiltInProfileMissing
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): ProfileBase
    {
        return ProfileBase::of((string) $value);
    }

    /**
     * @param  ProfileBase  $value
     * @param  array<string, mixed>  $attributes
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): string
    {
        return $value->key;
    }
}
