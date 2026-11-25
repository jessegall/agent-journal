<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Contracts\Authorization\PolicyCatalogue;
use App\Enums\Profiles\ModelTier;
use App\Models\Agents\Agent;
use App\Support\BuiltInAuthorizations;
use App\Values\PolicyDefinition;
use App\Values\ProfileBase;
use App\Values\ProfileKey;
use App\Values\ProfileSnapshot;
use App\Values\StartProfileAuthority;
use Illuminate\Container\Container;
use Tests\Fixtures\Profiles\TestStartPolicies;

/**
 * The authority an agent acts under in a test that sets it by hand: the pinned built-in profile of its kind, with the
 * grants of every policy registered now, as a real start would carry.
 */
final class TestStartAuthority
{
    /**
     * The authority of the agent's own kind, read from the built-in profile it starts with when the agent exists; a
     * main agent otherwise.
     */
    public static function forAgent(string $agentId): StartProfileAuthority
    {
        $profileKey = Agent::query()->whereKey($agentId)->value('profile_key');

        $base = array_find(ProfileBase::all(), fn (ProfileBase $base) => $base->key === $profileKey);

        return self::of($base ?? ProfileBase::mainAgent());
    }

    public static function of(ProfileBase|null $base = null): StartProfileAuthority
    {
        return self::granting(
            $base ?? ProfileBase::mainAgent(),
            Container::getInstance()->make(PolicyCatalogue::class)->grantable(),
        );
    }

    /**
     * The authority of a profile of the kind granting only the given policies' abilities; none grants nothing.
     *
     * @param  list<PolicyDefinition>  $definitions
     */
    public static function granting(ProfileBase $type, array $definitions): StartProfileAuthority
    {

        return new StartProfileAuthority(ProfileSnapshot::from([
            'key' => ProfileKey::from($type->key),
            'revision' => 1,
            'base' => $type,
            'instructions' => 'Work as the test asks.',
            'preferredTier' => ModelTier::Inventive,
            'skillAllowlist' => null,
            'requiredSkills' => [],
            'start' => TestStartPolicies::for($type),
            'authorization' => BuiltInAuthorizations::for($type, $definitions),
        ]));
    }
}
