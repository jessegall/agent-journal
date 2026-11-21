<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Connections\Models\InstallAttempt;
use App\Connections\Models\ProjectInvitation;
use App\Connections\Support\InstallAttemptList;
use Illuminate\Testing\TestResponse;
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
        'projects', 'agent_runtimes', 'agents', 'hosts', 'settings_records', 'users',
    ];

    public function test_replacing_one_tabs_attempt_leaves_the_other_tabs_line_usable(): void
    {
        $tabA = $this->issue(['issuanceKey' => 'tab-a'])->assertCreated();
        $tabB = $this->issue(['issuanceKey' => 'tab-b'])->assertCreated();

        $this->issue([
            'issuanceKey' => 'tab-a',
            'attemptReference' => $tabA->json('attemptReference'),
            'seenVersion' => $tabA->json('attemptVersion'),
        ])->assertCreated();

        $this->assertNotSame($tabA->json('attemptReference'), $tabB->json('attemptReference'));
        $this->assertSame(2, ProjectInvitation::query()->pending()->count());
        $this->assertNotNull(ProjectInvitation::query()->pending()->find($tabB->json('invitationId')));
        $this->assertNull(ProjectInvitation::query()->pending()->find($tabA->json('invitationId')));
    }

    public function test_two_replacements_from_the_same_version_leave_one_live_line(): void
    {
        $issued = $this->issue(['issuanceKey' => 'tab-a'])->assertCreated();
        $replacement = [
            'issuanceKey' => 'tab-a',
            'attemptReference' => $issued->json('attemptReference'),
            'seenVersion' => $issued->json('attemptVersion'),
        ];

        $this->issue($replacement)->assertCreated();
        $stale = $this->issue($replacement)->assertConflict();

        $this->assertSame(2, $stale->json('details.version'));
        $this->assertSame(1, ProjectInvitation::query()->pending()->count());
    }

    public function test_a_lost_reply_is_replaced_by_the_attempts_reference_without_a_second_attempt(): void
    {
        $issued = $this->issue(['issuanceKey' => 'tab-a'])->assertCreated();

        $again = $this->issue(['issuanceKey' => 'tab-a', 'attemptReference' => $issued->json('attemptReference')])
            ->assertCreated();

        $this->assertSame($issued->json('attemptReference'), $again->json('attemptReference'));
        $this->assertSame(1, InstallAttempt::query()->count());
        $this->assertSame(1, ProjectInvitation::query()->pending()->count());
    }

    public function test_a_spent_attempt_answers_its_binding_and_issues_no_new_line(): void
    {
        $issued = $this->issue(['issuanceKey' => 'tab-a'])->assertCreated();
        preg_match('#/install/([A-Za-z0-9_-]+)#', (string) $issued->json('installLine'), $ticket);
        $binding = $this->redeemLine($ticket[1], 'nonce-aaaaaaaaaaaaaaaa')->assertCreated()->json('bindingId');

        $stale = $this->issue(['issuanceKey' => 'tab-a', 'attemptReference' => $issued->json('attemptReference')])
            ->assertConflict();

        $this->assertSame('spent', $stale->json('details.state'));
        $this->assertSame($binding, $stale->json('details.bindingId'));
        $this->assertSame(0, ProjectInvitation::query()->pending()->count());
    }

    public function test_the_owner_lists_attempts_by_reference_with_no_ticket(): void
    {
        $issued = $this->issue(['issuanceKey' => 'tab-a'])->assertCreated();
        $this->issue(['issuanceKey' => 'tab-b'])->assertCreated();
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser($this->owner->id),
            new OwnerAuthority('test'),
        );

        $page = $this->app->make(InstallAttemptList::class)->page(null);

        $this->assertSame(['open', 'open'], array_map(fn ($row) => $row->state, $page->rows));
        $this->assertContains($issued->json('attemptReference'), array_map(fn ($row) => $row->reference, $page->rows));
        $this->assertStringNotContainsString(
            (string) $issued->json('installLine'),
            (string) json_encode($page),
        );
    }

    /**
     * @param  array<string, string|int|null>  $body
     */
    private function issue(array $body): TestResponse
    {
        return $this->actingAs($this->owner)->postJson('/settings/project-connections/invitations', $body);
    }
}
