<?php

declare(strict_types=1);

namespace App\Skills\Conditions;

use App\Profiles\Enums\ProfileType;
use App\Profiles\Values\ProfileKey;
use App\Skills\Contracts\SkillCondition;
use App\Programs\Values\ProgramKey;
use App\Programs\Values\ProviderKey;
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

    public static function mainAgent(): MainAgent
    {
        return new MainAgent();
    }

    public static function profiles(ProfileKey ...$keys): Profiles
    {
        return new Profiles(array_values($keys));
    }

    public static function agentTypes(ProfileType ...$types): AgentTypes
    {
        return new AgentTypes(array_values($types));
    }

    public static function programs(ProgramKey ...$keys): Programs
    {
        return new Programs(array_values($keys));
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
