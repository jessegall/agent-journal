<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\Commands\CommandRules\RevokeCommandPermissions\RevokeCommandPermissionsCommand;
use App\Enums\CommandRules\CommandClass;
use App\Models\Profiles\PermissionRevocation;
use App\Values\CommandClassSet;
use App\Values\CommandPermissions;
use App\Values\ProcessGrants;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The owner revokes command classes from a permission source, which narrows its next admission while the classes
 * left stay admitted.
 */
#[TestsCommand(RevokeCommandPermissionsCommand::class)]
final class RevokeCommandPermissionsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_deny_beats_a_class_allow_and_a_revocation_narrows_the_next_admission(): void
    {
        $main = CommandPermissions::granted('role:main', ProcessGrants::everything());
        $this->journal->owner()->run(new RevokeCommandPermissionsCommand($main->source, [CommandClass::Delete]));

        $narrowed = PermissionRevocation::resolveNarrow($main);

        $this->assertTrue($main->admits(CommandClassSet::of(CommandClass::Delete), ['rm', 'a']));
        $this->assertFalse($narrowed->admits(CommandClassSet::of(CommandClass::Delete), ['rm', 'a']));
        $this->assertTrue($narrowed->admits(CommandClassSet::of(CommandClass::Read), ['ls']));
    }
}
