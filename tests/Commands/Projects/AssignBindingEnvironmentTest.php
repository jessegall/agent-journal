<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Commands\Projects\AssignBindingEnvironment\AssignBindingEnvironmentCommand;
use App\Models\Projects\Environment;
use App\Models\Projects\ProjectBinding;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A binding with no environment starts nothing until the owner assigns one.
 */
#[TestsCommand(AssignBindingEnvironmentCommand::class)]
final class AssignBindingEnvironmentTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const string NO_ENVIRONMENT = 'works in no environment yet';

    private const array TABLES = [
        'command_receipts', 'connection_audits', 'project_invitations', 'install_attempts', 'project_bindings',
        'project_environments', 'projects', 'agent_runtimes', 'agent_sessions', 'agents', 'hosts',
        'settings_records', 'users',
    ];

    public function test_a_binding_with_no_environment_starts_nothing_until_the_owner_assigns_one(): void
    {
        $binding = $this->connected('new-ticket', 'nonce-aaaaaaaaaaaaaaaa');
        $main = $binding->environment_id;
        ProjectBinding::query()->whereKey($binding->id)->update(['environment_id' => null]);

        $refused = $this->start($binding)->assertForbidden();
        $this->assertStringContainsString(self::NO_ENVIRONMENT, (string) $refused->json('message'));

        $this->actingAs($this->owner)
            ->putJson("/project-connections/bindings/{$binding->id}/environment/{$main}")
            ->assertNoContent();
        $this->assertFalse(ProjectBinding::query()->findOrFail($binding->id)->isEnvironmentUnassigned());
    }

    private function connected(string $ticket, string $nonce): ProjectBinding
    {
        $this->issueLine($ticket);

        $redeemed = $this->redeemLine($ticket, $nonce)->assertCreated();
        $this->notifyClaudeCode($nonce, (string) $redeemed->json('bindingId'));

        return ProjectBinding::query()->findOrFail($redeemed->json('bindingId'));
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
