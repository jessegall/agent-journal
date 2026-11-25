<?php

declare(strict_types=1);

namespace App\Support\Conditions;

use App\Contracts\Skills\SkillCondition;
use App\Enums\Agents\AccessType;
use App\Policies\AssignmentRecipientPolicy;
use App\Values\AccessRequirement;
use App\Values\DriverKey;
use App\Values\ProfileBase;
use App\Values\ProfileKey;
use App\Values\ProviderKey;
use Spatie\LaravelData\Data;

/**
 * Builds skill conditions for a skill's condition() method. What it builds is checked like a stored condition before
 * it is evaluated.
 */
final class Conditions
{
    public static function everyone(): Everyone
    {
        return new Everyone();
    }

    public static function granted(AccessRequirement ...$requirements): Grants
    {
        return new Grants(array_values($requirements));
    }

    /**
     * An actor whose profile lets it hand work to others: the guidance for coordinating the journal's work.
     */
    public static function dispatchesWork(): Grants
    {
        return self::granted(new AccessRequirement(AssignmentRecipientPolicy::class, AccessType::Delegate));
    }

    public static function profiles(ProfileKey ...$keys): Profiles
    {
        return new Profiles(array_values($keys));
    }

    public static function profileBases(ProfileBase ...$bases): ProfileBases
    {
        return new ProfileBases(array_values($bases));
    }

    public static function drivers(DriverKey ...$keys): Drivers
    {
        return new Drivers(array_values($keys));
    }

    public static function providers(ProviderKey ...$keys): Providers
    {
        return new Providers(array_values($keys));
    }

    public static function environments(string ...$keys): Environments
    {
        return new Environments(array_values($keys));
    }

    /**
     * A condition type registered under an owner-prefixed key, with its parameters at the given schema version.
     */
    public static function named(string $key, Data $parameters, int $version = 1): Named
    {
        return new Named($key, $version, $parameters->toArray());
    }

    public static function all(SkillCondition ...$children): AllOf
    {
        return new AllOf(array_values($children));
    }

    public static function any(SkillCondition ...$children): AnyOf
    {
        return new AnyOf(array_values($children));
    }

    public static function not(SkillCondition $child): Not
    {
        return new Not($child);
    }
}
