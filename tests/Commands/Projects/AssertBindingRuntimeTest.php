<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Commands\Inboxes\InstallInboxes\InstallInboxesCommand;
use App\Enums\Accounts\CommandEntry;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Projects\ProjectBinding;
use App\Support\JournalCommands;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A start through a binding is checked before any runtime: another folder root, id or agent, and a program the
 * binding may not start, are refused by name.
 */
final class AssertBindingRuntimeTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;
    use WithActiveAccount;

    private const string HOOKS_NOT_KEPT = 'Codex does not keep its hooks to one session';

    private const string CLAUDE_NOT_REPORTED = 'has not reported it can run Claude Code';

    private const array TABLES = [
        'connection_audits', 'project_invitations', 'install_attempts', 'binding_runtimes', 'project_bindings',
        'project_environments', 'projects', 'agent_runtimes', 'agent_sessions', 'agents', 'hosts', 'settings_records',
        'users', 'accounts', 'active_accounts', 'inboxes', 'inbox_members',
    ];

    private const string NONCE = 'nonce-aaaaaaaaaaaaaaaa';

    protected function setUp(): void
    {
        parent::setUp();

        $this->chooseActiveAccounts();
        $this->app->make(JournalCommands::class)
            ->runAsJournal(CommandEntry::HostControl, 'inbox install', new InstallInboxesCommand());
    }

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

    public function test_a_program_the_binding_may_not_start_is_refused_by_name_before_any_runtime(): void
    {
        $binding = $this->connected('the-ticket', self::NONCE);
        $silent = $this->redeemed('other-ticket', 'nonce-bbbbbbbbbbbbbbbb');
        $this->notifyPresence('nonce-bbbbbbbbbbbbbbbb', $silent->id, []);

        $codex = $this->start($binding, ['driver' => 'codex'])->assertForbidden();
        $unreported = $this->signedStart('nonce-bbbbbbbbbbbbbbbb', $silent, [])->assertForbidden();

        $this->assertStringContainsString(
            self::HOOKS_NOT_KEPT,
            (string) $codex->json('message'),
        );
        $this->assertStringContainsString(
            self::CLAUDE_NOT_REPORTED,
            (string) $unreported->json('message'),
        );
        $this->assertSame(0, AgentRuntime::query()->count());
    }

    /**
     * A redeemed binding whose relay reported it can run Claude Code isolated.
     */
    private function connected(string $ticket, string $nonce): ProjectBinding
    {
        $binding = $this->redeemed($ticket, $nonce);
        $this->notifyClaudeCode($nonce, $binding->id);

        return $binding;
    }

    private function redeemed(string $ticket, string $nonce): ProjectBinding
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
                'model' => 'opus',
                ...$changes,
            ],
            (string) Str::uuid(),
        );
    }
}
