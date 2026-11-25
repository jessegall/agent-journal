<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Models\Projects\Project;
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
        $issued = $this->issuedLine(['issuanceKey' => 'action-1']);

        $page = $this->actingAs($this->owner)->get('/connections')->assertOk()->assertInertia(fn (
            AssertableInertia $page,
        ) => $page
            ->component('connections/ConnectProjectWindow')
            ->where('page.data.serverName', 'journal.example.com')
            ->where('page.data.origin', 'https://journal.example.com')
            ->where('page.data.canIssue', true)
            ->where('page.data.projects.0.label', 'Shop')
            ->where('page.data.projects.0.environments.0.label', 'Main')
            ->where('page.data.release.targets.0.name', 'darwin-arm64')
            ->where('page.data.release.targets.0.bytes', 9_000_000)
            ->where('page.data.release.targets.0.prerequisites', ['git', 'curl'])
            ->where('page.data.release.missingCapabilities', [])
            ->has('page.data.attempts.rows', 2)
            ->where('page.data.attempts.rows.0.state', 'open')
            ->has('page.data.bindings.rows', 1)
            ->where('page.data.bindings.rows.0.projectLabel', 'Shop')
            ->where('page.data.bindings.rows.0.machineLabel', 'Owner laptop')
            ->where('page.data.bindings.rows.0.environmentLabel', 'Main')
            ->where('page.data.bindings.rows.0.stateText', 'Waiting for first contact.')
            ->where('page.data.bindings.rows.0.state', 'pending'));

        $this->assertStringNotContainsString((string) $issued['installLine'], (string) $page->getContent());
        $this->assertStringNotContainsString('/Users/owner/shop', (string) $page->getContent());
    }

    public function test_a_ready_folder_offers_start_for_claude_code_only_and_names_why_codex_is_unavailable(): void
    {
        $this->issueLine('the-ticket');
        $binding = (string) $this->redeemLine('the-ticket', 'nonce-aaaaaaaaaaaaaaaa')->assertCreated()->json('bindingId');
        $this->notifyClaudeCode('nonce-aaaaaaaaaaaaaaaa', $binding);

        $this->actingAs($this->owner)->get('/connections')->assertOk()->assertInertia(fn (
            AssertableInertia $page,
        ) => $page
            ->where('page.data.bindings.rows.0.state', 'ready')
            ->where('page.data.bindings.rows.0.capabilities.0.driver', 'claude-code')
            ->where('page.data.bindings.rows.0.capabilities.0.canStart', true)
            ->where('page.data.bindings.rows.0.capabilities.1.driver', 'codex')
            ->where('page.data.bindings.rows.0.capabilities.1.canStart', false)
            ->where(
                'page.data.bindings.rows.0.capabilities.1.unavailableReason',
                fn (string $reason) => str_contains($reason, 'Codex does not keep its hooks to one session'),
            ));
    }
}
