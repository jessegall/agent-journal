<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Commands\Inboxes\InstallInboxes\InstallInboxesCommand;
use App\Commands\Projects\AssertBindingRuntime\AssertBindingRuntimeCommand;
use App\Enums\Accounts\CommandEntry;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Projects\ProjectBinding;
use App\Support\JournalCommands;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A start through a binding is checked before any runtime: another folder root, id or agent, and a program the
 * binding may not start, are refused by name.
 */
#[TestsCommand(AssertBindingRuntimeCommand::class)]
final class AssertBindingRuntimeTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;
    use WithActiveAccount;

    private const string HOOKS_NOT_KEPT = 'Codex does not keep its hooks to one session';

    private const array TABLES = [
        'connection_audits',
        'project_invitations',
        'install_attempts',
        'binding_runtimes',
        'project_bindings',
        'project_environments',
        'projects',
        'agent_runtimes',
        'agent_sessions',
        'agents',
        'hosts',
        'settings_records',
        'users',
        'accounts',
        'active_accounts',
        'inboxes',
        'inbox_members',
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

        $codex = $this->start($binding, ['driver' => 'codex'])->assertForbidden();

        $this->assertStringContainsString(
            self::HOOKS_NOT_KEPT,
            (string) $codex->json('message'),
        );
        $this->assertSame(0, AgentRuntime::query()->count());
    }

    public function test_a_start_of_a_revoked_binding_cannot_be_looked_up(): void
    {
        $binding = $this->connected('the-ticket', self::NONCE);
        $this->start($binding, ['startId' => 'start-1'])->assertCreated();
        ProjectBinding::query()->whereKey($binding->id)->update(['readiness' => 'revoked']);

        $this->start($binding, ['startId' => 'start-1'])->assertForbidden();
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

        return ProjectBinding::query()->findOrFail(
            $this->redeemLine($ticket, $nonce)->assertCreated()->json('bindingId'),
        );
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
                'profile' => 'main-agent',
                'model' => 'opus',
                ...$changes,
            ],
            (string) Str::uuid(),
        );
    }
}
