<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Agents\Enums\HostProtocolVersion;
use App\Agents\Models\AgentRuntime;
use App\Connections\Models\ProjectBinding;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\TestCase;

/**
 * A binding opens its main runtime only for its own root: another folder, another binding's root id or another
 * agent is refused before any runtime or grant.
 */
final class BindingStartTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const array TABLES = [
        'connection_audits', 'project_invitations', 'install_attempts', 'project_bindings', 'projects', 'agent_runtimes',
        'agent_sessions', 'agents', 'hosts', 'settings_records', 'users',
    ];

    private const string NONCE = 'nonce-aaaaaaaaaaaaaaaa';

    public function test_another_folder_root_id_or_agent_is_refused_before_any_runtime(): void
    {
        $binding = $this->connected('the-ticket', self::NONCE);
        $other = $this->connected('other-ticket', 'nonce-bbbbbbbbbbbbbbbb');
        $runtimes = AgentRuntime::query()->count();

        $this->start($binding, ['folder' => '/Users/owner/elsewhere'])->assertForbidden();
        $this->start($binding, ['rootId' => $other->root_id])->assertForbidden();
        $this->start($binding, ['agentId' => $other->main_agent_id])->assertForbidden();
        $this->signedStart(self::NONCE, $other, [])->assertForbidden();

        $this->assertSame($runtimes, AgentRuntime::query()->count());
    }

    private function connected(string $ticket, string $nonce): ProjectBinding
    {
        $this->issueLine($ticket);

        return ProjectBinding::query()->findOrFail($this->redeemLine($ticket, $nonce)->assertCreated()->json('bindingId'));
    }

    /**
     * @param  array<string, string>  $changes
     */
    private function start(ProjectBinding $binding, array $changes): TestResponse
    {
        return $this->signedStart(self::NONCE, $binding, $changes);
    }

    /**
     * @param  array<string, string>  $changes
     */
    private function signedStart(string $nonce, ProjectBinding $binding, array $changes): TestResponse
    {
        return $this->signedRelayCall(
            $this->relayCredential($nonce),
            "/host/bindings/{$binding->id}/runtimes",
            [
                'rootId' => $binding->root_id,
                'folder' => $binding->canonical_root,
                'agentId' => $binding->main_agent_id,
                'driver' => 'claude-code',
                'driverBuild' => '2.1.323',
                'profile' => 'main-agent',
                ...$changes,
            ],
            HostProtocolVersion::RemoteProject,
            (string) Str::uuid(),
        );
    }
}
