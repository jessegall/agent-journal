<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Actors\Contracts\PolicyCatalogue;
use App\Agents\Enums\AgentRole;
use App\Agents\Models\Agent;
use App\Profiles\Enums\ProfileType;
use App\Profiles\Support\BuiltInAuthorizations;
use App\Profiles\Values\LaunchProfileAuthority;
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
     * The authority of the agent's own kind, read from its role when the agent exists; a main agent otherwise.
     */
    public static function forAgent(string $agentId): LaunchProfileAuthority
    {
        $role = Agent::query()->whereKey($agentId)->value('role');

        return self::of($role === null ? ProfileType::MainAgent : ProfileType::forRole(AgentRole::from($role)));
    }

    public static function of(ProfileType $type = ProfileType::MainAgent): LaunchProfileAuthority
    {
        $registrations = Container::getInstance()->make(PolicyCatalogue::class)->grantable();

        return new LaunchProfileAuthority(ProfileSnapshot::from([
            'key' => ProfileKey::from(str_replace('_', '-', $type->value)),
            'revision' => 1,
            'type' => $type,
            'instructions' => 'Work as the test asks.',
            'model' => 'opus',
            'skillAllowlist' => null,
            'requiredSkills' => [],
            'launch' => TestLaunchPolicies::for($type),
            'authorization' => BuiltInAuthorizations::for($type, $registrations),
        ]));
    }
}
