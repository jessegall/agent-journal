<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Processes\Enums\CommandClass;
use App\Processes\Models\PermissionRevocation;
use App\Processes\Values\CommandClassSet;
use App\Processes\Values\CommandPattern;
use App\Processes\Values\CommandPatternSet;
use App\Processes\Values\CommandPermissions;
use App\Processes\Values\ProcessGrants;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Each role runs only what its permissions and ceiling allow; denies beat allows and revocations narrow the next
 * admission (doc 21 revision 6, sections 10 and 28; stories 49-53).
 */
final class CommandPermissionsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_read_only_helper_reads_and_uses_git_but_never_writes_or_checks(): void
    {
        $helper = CommandPermissions::granted('role:read-only', ProcessGrants::readingOnly());

        $this->assertTrue(
            $helper->admits(CommandClassSet::of(CommandClass::Read, CommandClass::VersionControl), ['git', 'status']),
        );
        $this->assertFalse($helper->admits(CommandClassSet::of(CommandClass::Write), ['touch', 'a']));
        $this->assertFalse(
            $helper->admits(
                CommandClassSet::of(CommandClass::Read, CommandClass::Verification),
                ['phpstan', 'analyse'],
            ),
        );
    }

    public function test_an_exact_allow_admits_only_that_invocation(): void
    {
        $helper = CommandPermissions::granted('role:read-only', ProcessGrants::readingOnly())->allowing(
            CommandPattern::exact('curl', '--head', 'https://example.org/'),
        );
        $network = CommandClassSet::of(CommandClass::Network);

        $this->assertTrue($helper->admits($network, ['curl', '--head', 'https://example.org/']));
        $this->assertFalse($helper->admits($network, ['curl', '--head', 'https://example.com/']));
        $this->assertFalse(
            $helper->admits(
                CommandClassSet::of(CommandClass::Network, CommandClass::Write),
                ['curl', '-o', 'page', 'https://example.org/'],
            ),
        );
    }

    public function test_an_allow_never_lifts_the_read_only_ceiling(): void
    {
        $helper = CommandPermissions::granted(
            'role:read-only',
            ProcessGrants::readingOnly(),
        )->allowing(CommandPattern::exact('touch', 'notes.txt'));

        $this->assertFalse($helper->admits(CommandClassSet::of(CommandClass::Write), ['touch', 'notes.txt']));
    }

    public function test_a_deny_beats_a_class_allow_and_a_revocation_narrows_the_next_admission(): void
    {
        $main = CommandPermissions::granted('role:main', ProcessGrants::everything());
        PermissionRevocation::revoke(
            $main->source,
            CommandClassSet::of(CommandClass::Delete),
            CommandPatternSet::of(),
            new ActorIdentity(ActorType::User, 'owner'),
        );

        $narrowed = PermissionRevocation::narrow($main);

        $this->assertTrue($main->admits(CommandClassSet::of(CommandClass::Delete), ['rm', 'a']));
        $this->assertFalse($narrowed->admits(CommandClassSet::of(CommandClass::Delete), ['rm', 'a']));
        $this->assertTrue($narrowed->admits(CommandClassSet::of(CommandClass::Read), ['ls']));
    }
}
