<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use Domain\Access\Models\User;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\TestCase;

/**
 * The owner's Connect a project window: whether it may issue lines and every connected folder with its state; an
 * issued line never reaches the page, and anyone else sees none of it.
 */
final class ConnectProjectWindowTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const array TABLES = [
        'command_receipts', 'connection_audits', 'project_invitations', 'install_attempts', 'project_bindings',
        'project_environments', 'projects', 'agent_runtimes', 'agents', 'hosts', 'settings_records', 'users',
    ];

    public function test_the_owner_sees_the_server_its_bindings_and_never_an_issued_line(): void
    {
        $this->issueLine('the-ticket');
        $this->redeemLine('the-ticket', 'nonce-aaaaaaaaaaaaaaaa')->assertCreated();
        $issued = $this->actingAs($this->owner)
            ->postJson('/settings/project-connections/invitations', ['issuanceKey' => 'action-1'])
            ->assertCreated();

        $page = $this->actingAs($this->owner)->get('/connections')->assertOk()->assertInertia(fn (
            AssertableInertia $page,
        ) => $page
            ->component('connections/ConnectProjectWindow')
            ->where('page.data.serverName', 'journal.example.com')
            ->where('page.data.canIssue', true)
            ->where('page.data.release.targets.0.name', 'darwin-arm64')
            ->where('page.data.release.targets.0.bytes', 9_000_000)
            ->where('page.data.release.targets.0.prerequisites', ['git', 'curl'])
            ->where('page.data.release.missingCapabilities', [])
            ->has('page.data.bindings', 1)
            ->where('page.data.bindings.0.projectLabel', 'Shop')
            ->where('page.data.bindings.0.machineLabel', 'Owner laptop')
            ->where('page.data.bindings.0.state', 'pending'));

        $this->assertStringNotContainsString((string) $issued->json('installLine'), (string) $page->getContent());
        $this->assertStringNotContainsString('/Users/owner/shop', (string) $page->getContent());
    }

    public function test_someone_other_than_the_owner_sees_no_window(): void
    {
        $other = User::factory()->create();

        $this->assertFalse($this->actingAs($other)->get('/connections')->isOk());
    }
}
