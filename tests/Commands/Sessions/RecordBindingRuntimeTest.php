<?php

declare(strict_types=1);

namespace Tests\Commands\Sessions;

use App\Commands\Inboxes\InstallInboxes\InstallInboxesCommand;
use App\Commands\Sessions\RecordBindingRuntime\RecordBindingRuntimeCommand;
use App\Enums\Accounts\CommandEntry;
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
 * A start through a binding records the runtime it opened, so the same start asked again under its id answers that
 * one runtime.
 */
#[TestsCommand(RecordBindingRuntimeCommand::class)]
final class RecordBindingRuntimeTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;
    use WithActiveAccount;

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

    public function test_a_start_asked_again_under_its_id_answers_the_one_runtime_it_opened(): void
    {
        $binding = $this->connected('the-ticket', self::NONCE);

        $first = $this->start($binding, ['startId' => 'start-1'])->assertCreated();
        $again = $this->start($binding, ['startId' => 'start-1'])->assertOk();

        $this->assertSame($first->json('runtime_id'), $again->json('runtime_id'));
        $this->assertSame($first->json('session_id'), $again->json('session_id'));
        $this->assertSame(1, AgentRuntime::query()->count());
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
                'profile' => 'main-agent',
                'model' => 'opus',
                ...$changes,
            ],
            (string) Str::uuid(),
        );
    }
}
