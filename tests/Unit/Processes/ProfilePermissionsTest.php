<?php

declare(strict_types=1);

namespace Tests\Unit\Processes;

use App\CommandRules\Enums\CommandClass;
use App\Models\Agents\Agent;
use App\Sessions\Values\ProcessGrants;
use App\Values\CommandClassSet;
use App\Values\CommandPattern;
use App\Values\CommandPatternSet;
use App\Values\CommandPermissions;
use Tests\TestCase;

/**
 * What an agent may run comes from the profile its session was pinned to: the owner asking for another agent gets that
 * agent's ceiling, never its own, and a denied pattern beats an exact allow.
 */
final class ProfilePermissionsTest extends TestCase
{
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
