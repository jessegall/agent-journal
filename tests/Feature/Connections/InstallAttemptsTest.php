<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Contracts\CurrentActorSetter;
use App\Models\InstallAttempt;
use App\Models\ProjectInvitation;
use App\Support\ActorContext;
use App\Support\InstallAttemptList;
use App\Values\OwnerAuthority;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\TestCase;

/**
 * Each tab of one owner holds its own install attempt: replacing one leaves the other usable, a repeated or stale
 * replacement leaves one live line, a lost reply is replaced by the attempt's reference, and a spent attempt answers
 * the binding it made rather than a new line.
 */
final class InstallAttemptsTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const array TABLES = [
        'command_receipts', 'connection_audits', 'project_invitations', 'install_attempts', 'project_bindings',
        'project_environments', 'projects', 'agent_runtimes', 'agents', 'hosts', 'settings_records', 'users',
    ];

    public function test_replacing_one_tabs_attempt_leaves_the_other_tabs_line_usable(): void
    {
        $tabA = $this->issuedLine(['issuanceKey' => 'tab-a']);
        $tabB = $this->issuedLine(['issuanceKey' => 'tab-b']);

        $this->issuedLine([
            'issuanceKey' => 'tab-a',
            'attemptReference' => $tabA['attemptReference'],
            'seenVersion' => $tabA['attemptVersion'],
        ]);

        $this->assertNotSame($tabA['attemptReference'], $tabB['attemptReference']);
        $this->assertSame(2, ProjectInvitation::query()->pending()->count());
        $this->assertNotNull(ProjectInvitation::query()->pending()->find($tabB['invitationId']));
        $this->assertNull(ProjectInvitation::query()->pending()->find($tabA['invitationId']));
    }

    public function test_two_replacements_from_the_same_version_leave_one_live_line(): void
    {
        $issued = $this->issuedLine(['issuanceKey' => 'tab-a']);
        $replacement = [
            'issuanceKey' => 'tab-a',
            'attemptReference' => $issued['attemptReference'],
            'seenVersion' => $issued['attemptVersion'],
        ];

        $this->issuedLine($replacement);
        $stale = $this->refusedLine($replacement);

        $this->assertSame('install-attempt-refused', $stale);
        $this->assertSame(2, InstallAttempt::query()->sole()->version);
        $this->assertSame(1, ProjectInvitation::query()->pending()->count());
    }

    public function test_a_lost_reply_is_replaced_by_the_attempts_reference_without_a_second_attempt(): void
    {
        $issued = $this->issuedLine(['issuanceKey' => 'tab-a']);

        $again = $this->issuedLine(['issuanceKey' => 'tab-a', 'attemptReference' => $issued['attemptReference']]);

        $this->assertSame($issued['attemptReference'], $again['attemptReference']);
        $this->assertSame(1, InstallAttempt::query()->count());
        $this->assertSame(1, ProjectInvitation::query()->pending()->count());
    }

    public function test_a_spent_attempt_answers_its_binding_and_issues_no_new_line(): void
    {
        $issued = $this->issuedLine(['issuanceKey' => 'tab-a']);
        preg_match('#/install/([A-Za-z0-9_-]+)#', (string) $issued['installLine'], $ticket);
        $binding = $this->redeemLine($ticket[1], 'nonce-aaaaaaaaaaaaaaaa')->assertCreated()->json('bindingId');

        $stale = $this->refusedLine(['issuanceKey' => 'tab-a', 'attemptReference' => $issued['attemptReference']]);

        $this->assertIsString($stale);
        $this->assertSame($binding, InstallAttempt::query()->sole()->binding_id);
        $this->assertSame(0, ProjectInvitation::query()->pending()->count());
    }

    public function test_the_owner_lists_attempts_by_reference_with_no_ticket(): void
    {
        $issued = $this->issuedLine(['issuanceKey' => 'tab-a']);
        $this->issuedLine(['issuanceKey' => 'tab-b']);
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser($this->owner->id),
            new OwnerAuthority('test'),
        );

        $page = $this->app->make(InstallAttemptList::class)->page(null);

        $this->assertSame(['open', 'open'], array_map(fn ($row) => $row->state, $page->rows));
        $this->assertContains($issued['attemptReference'], array_map(fn ($row) => $row->reference, $page->rows));
        $this->assertStringNotContainsString(
            (string) $issued['installLine'],
            (string) json_encode($page),
        );
    }
}
