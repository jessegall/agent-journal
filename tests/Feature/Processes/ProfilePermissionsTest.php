<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Actors\Support\ActorIdentity;
use App\Agents\Actions\StartSessions;
use App\Agents\Models\Agent;
use App\Processes\Contracts\CommandPermissionResolver;
use App\Processes\Enums\CommandClass;
use App\Processes\Values\CommandClassSet;
use App\Processes\Values\CommandPattern;
use App\Processes\Values\CommandPatternSet;
use App\Processes\Values\CommandPermissions;
use App\Processes\Values\ProcessGrants;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * What an agent may run comes from the profile its session was pinned to: the owner asking for another agent gets that
 * agent's ceiling, never its own, and a denied pattern beats an exact allow.
 */
final class ProfilePermissionsTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    public function test_the_owner_gets_a_read_only_helpers_ceiling_for_that_helper(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $helper = Agent::create('Reader', 'read-only-helper');
        $this->app->make(StartSessions::class)
            ->start($helper, TestSelections::of('claude-code'), TestSelections::requestId());
        $this->startUserRequestAs($owner->id);

        $permissions = $this->app->make(CommandPermissionResolver::class)->forActor(ActorIdentity::of($helper));

        $this->assertTrue($permissions->admits(CommandClassSet::of(CommandClass::Read), ['cat', 'notes.txt']));
        $this->assertFalse($permissions->admits(CommandClassSet::of(CommandClass::Build), ['npm', 'run', 'build']));
        $this->assertStringStartsWith('profile:', $permissions->source);
    }

    public function test_a_denied_pattern_beats_an_exact_allow(): void
    {
        $grants = ProcessGrants::everything();
        $denying = new ProcessGrants(
            $grants->allowed,
            $grants->denied,
            $grants->ceiling,
            CommandPatternSet::of(CommandPattern::exact('git', 'push')),
            CommandPatternSet::of(CommandPattern::exact('git', 'push')),
        );

        $permissions = CommandPermissions::granted('profile:test@1', $denying);

        $this->assertFalse($permissions->admits(CommandClassSet::of(CommandClass::VersionControl), ['git', 'push']));
        $this->assertTrue($permissions->admits(CommandClassSet::of(CommandClass::VersionControl), ['git', 'status']));
    }
}
