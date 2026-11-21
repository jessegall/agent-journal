<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Agents\Enums\HostProtocolVersion;
use App\Connections\Models\Environment;
use App\Connections\Models\Project;
use App\Connections\Models\ProjectBinding;
use App\Connections\Models\ProjectInvitation;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\TestCase;

/**
 * Every binding works in an environment of its project: a new project starts with Main, a Join line lands in the
 * environment it names and is unusable, unspent, once that environment is gone, and a binding with no environment
 * starts nothing until the owner assigns one.
 */
final class EnvironmentsTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const array TABLES = [
        'command_receipts', 'connection_audits', 'project_invitations', 'install_attempts', 'project_bindings',
        'project_environments', 'projects', 'agent_runtimes', 'agent_sessions', 'agents', 'hosts',
        'settings_records', 'users',
    ];

    public function test_a_new_line_makes_one_project_with_one_main_environment_and_the_binding_in_it(): void
    {
        $binding = $this->connected('new-ticket', 'nonce-aaaaaaaaaaaaaaaa');

        $environments = Environment::query()->where('project_id', $binding->project_id)->get();
        $this->assertSame(1, Project::query()->count());
        $this->assertSame([Environment::DEFAULT_LABEL], $environments->pluck('label')->all());
        $this->assertSame($environments->sole()->id, $binding->environment_id);
    }

    public function test_a_join_line_lands_in_the_environment_it_names(): void
    {
        $first = $this->connected('new-ticket', 'nonce-aaaaaaaaaaaaaaaa');
        $research = Environment::create(Project::query()->sole(), 'Research');
        $ticket = $this->joinTicket($first->project_id, $research->id);

        $joined = $this->redeemLine($ticket, 'nonce-bbbbbbbbbbbbbbbb')->assertCreated();

        $binding = ProjectBinding::query()->findOrFail($joined->json('bindingId'));
        $this->assertSame($research->id, $binding->environment_id);
    }

    public function test_a_join_line_whose_environment_is_gone_is_refused_and_stays_unspent(): void
    {
        $first = $this->connected('new-ticket', 'nonce-aaaaaaaaaaaaaaaa');
        $research = Environment::create(Project::query()->sole(), 'Research');
        $ticket = $this->joinTicket($first->project_id, $research->id);
        $research->delete();

        $this->redeemLine($ticket, 'nonce-bbbbbbbbbbbbbbbb')->assertNotFound();

        $this->assertSame(1, ProjectInvitation::query()->pending()->count());
        $this->assertSame(1, ProjectBinding::query()->count());
    }

    public function test_a_binding_with_no_environment_starts_nothing_until_the_owner_assigns_one(): void
    {
        $binding = $this->connected('new-ticket', 'nonce-aaaaaaaaaaaaaaaa');
        $main = $binding->environment_id;
        ProjectBinding::query()->whereKey($binding->id)->update(['environment_id' => null]);

        $refused = $this->start($binding)->assertForbidden();
        $this->assertStringContainsString('works in no environment yet', (string) $refused->json('message'));

        $this->actingAs($this->owner)
            ->putJson("/settings/project-connections/bindings/{$binding->id}/environment/{$main}")
            ->assertNoContent();
        $this->assertFalse(ProjectBinding::query()->findOrFail($binding->id)->isEnvironmentUnassigned());
    }

    private function connected(string $ticket, string $nonce): ProjectBinding
    {
        $this->issueLine($ticket);

        $redeemed = $this->redeemLine($ticket, $nonce)->assertCreated();
        $this->reportClaudeCode($nonce, (string) $redeemed->json('bindingId'));

        return ProjectBinding::query()->findOrFail($redeemed->json('bindingId'));
    }

    private function joinTicket(string $projectId, string $environmentId): string
    {
        $issued = $this->actingAs($this->owner)->postJson('/settings/project-connections/invitations', [
            'issuanceKey' => 'join-'.Str::random(6),
            'projectId' => $projectId,
            'environmentId' => $environmentId,
        ])->assertCreated();
        preg_match('#/install/([A-Za-z0-9_-]+)#', (string) $issued->json('installLine'), $ticket);

        return $ticket[1];
    }

    private function start(ProjectBinding $binding): TestResponse
    {
        return $this->signedRelayCall(
            $this->relayCredential('nonce-aaaaaaaaaaaaaaaa'),
            "/host/bindings/{$binding->id}/runtimes",
            [
                'rootId' => $binding->root_id,
                'folder' => $binding->canonical_root,
                'agentId' => $binding->main_agent_id,
                'driver' => 'claude-code',
                'driverBuild' => '2.1.323',
                'profile' => 'main-agent',
            ],
            HostProtocolVersion::RemoteProject,
            (string) Str::uuid(),
        );
    }
}
