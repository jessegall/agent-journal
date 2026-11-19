<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Values\PolicyRegistration;
use App\Agents\Models\Agent;
use App\Profiles\Support\BuiltInAuthorizations;
use App\Profiles\Values\LaunchProfileAuthority;
use App\Profiles\Values\ProfileBase;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ProfileSnapshot;
use Illuminate\Container\Container;
use Tests\Fixtures\Profiles\TestLaunchPolicies;

/**
 * The authority an agent acts under in a test that sets it by hand: the pinned built-in profile of its kind, with the
 * grants of every policy registered now, as a real launch would carry.
 */
final class TestLaunchAuthority
{
    /**
     * The authority of the agent's own kind, read from the built-in profile it launches with when the agent exists; a
     * main agent otherwise.
     */
    public static function forAgent(string $agentId): LaunchProfileAuthority
    {
        $profileKey = Agent::query()->whereKey($agentId)->value('profile_key');

        return self::of(match ($profileKey) {
            'read-only-helper' => ProfileBase::readOnlyHelper(),
            'writing-helper' => ProfileBase::writingHelper(),
            default => ProfileBase::mainAgent(),
        });
    }

    public static function of(ProfileBase|null $base = null): LaunchProfileAuthority
    {
        return self::granting(
            $base ?? ProfileBase::mainAgent(),
            Container::getInstance()->make(PolicyCatalogue::class)->grantable(),
        );
    }

    /**
     * The authority of a profile of the kind granting only the given policies' abilities; none grants nothing.
     *
     * @param  list<PolicyRegistration>  $registrations
     */
    public static function granting(ProfileBase $type, array $registrations): LaunchProfileAuthority
    {

        return new LaunchProfileAuthority(ProfileSnapshot::from([
            'key' => ProfileKey::from($type->key),
            'revision' => 1,
            'base' => $type,
            'instructions' => 'Work as the test asks.',
            'model' => 'opus',
            'skillAllowlist' => null,
            'requiredSkills' => [],
            'launch' => TestLaunchPolicies::for($type),
            'authorization' => BuiltInAuthorizations::for($type, $registrations),
        ]));
    }
}
