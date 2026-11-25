<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Models\Projects\Environment;
use App\Models\Projects\Project;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\ProjectInvitation;
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

    private const string NO_ENVIRONMENT = 'works in no environment yet';

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

    private function connected(string $ticket, string $nonce): ProjectBinding
    {
        $this->issueLine($ticket);

        $redeemed = $this->redeemLine($ticket, $nonce)->assertCreated();
        $this->notifyClaudeCode($nonce, (string) $redeemed->json('bindingId'));

        return ProjectBinding::query()->findOrFail($redeemed->json('bindingId'));
    }

    private function joinTicket(string $projectId, string $environmentId): string
    {
        $issued = $this->issuedLine([
            'issuanceKey' => 'join-'.Str::random(6),
            'projectId' => $projectId,
            'environmentId' => $environmentId,
        ]);
        preg_match('#/install/([A-Za-z0-9_-]+)#', (string) $issued['installLine'], $ticket);

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
                'model' => 'default',
            ],
            (string) Str::uuid(),
        );
    }
}
