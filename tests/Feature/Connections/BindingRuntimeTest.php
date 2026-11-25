<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Commands\Inboxes\InstallInboxes\InstallInboxesCommand;
use App\Contracts\Assignments\AssignmentTransaction;
use App\Contracts\Sessions\ProfileResolver;
use App\Enums\Accounts\CommandEntry;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Models\Projects\ProjectBinding;
use App\Support\ActorIdentity;
use App\Support\EntryDispatchers;
use App\Support\MainInboxHandover;
use App\Values\ProfileKey;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A binding opens its main runtime only for its own root: another folder, another binding's root id or another
 * agent is refused before any runtime or grant.
 */
final class BindingRuntimeTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;
    use WithActiveAccount;

    private const string HOOKS_NOT_KEPT = 'Codex does not keep its hooks to one session';

    private const string CLAUDE_NOT_REPORTED = 'has not reported it can run Claude Code';

    private const string EARLIER_SESSIONS = 'reported what became of its earlier sessions';

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
        $this->app->make(EntryDispatchers::class)
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

    public function test_a_start_asked_again_under_its_id_answers_the_one_runtime_it_opened(): void
    {
        $binding = $this->connected('the-ticket', self::NONCE);

        $first = $this->start($binding, ['startId' => 'start-1'])->assertCreated();
        $again = $this->start($binding, ['startId' => 'start-1'])->assertOk();

        $this->assertSame($first->json('runtime_id'), $again->json('runtime_id'));
        $this->assertSame($first->json('session_id'), $again->json('session_id'));
        $this->assertSame(1, AgentRuntime::query()->count());
    }

    public function test_a_start_that_names_no_model_takes_its_profiles_default(): void
    {
        $binding = $this->connected('the-ticket', self::NONCE);

        $started = $this->start($binding, ['model' => 'default'])->assertCreated();

        $profile = $this->app->make(ProfileResolver::class)->snapshotFor(ProfileKey::from('main-agent'));
        $this->assertSame($profile->model, AgentSession::query()->findOrFail($started->json('session_id'))->model);
    }

    public function test_a_binding_runtime_leaves_the_servers_main_agent_attached_to_main(): void
    {
        $serverMain = Agent::create('Server main', 'main-agent');
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(MainInboxHandover::class)->takeOver($serverMain),
        );
        $binding = $this->connected('the-ticket', self::NONCE);

        $this->start($binding, [])->assertCreated();

        $this->assertSame(
            [ActorIdentity::of($serverMain)->text()],
            array_map(fn (ActorIdentity $member) => $member->text(), InboxMember::attachedTo([Inbox::main()->id], Agent::class)),
        );
        $this->assertTrue(Agent::query()->findOrFail($serverMain->id)->currentRuntime()->isEmpty());
    }

    public function test_a_start_of_a_revoked_binding_cannot_be_looked_up(): void
    {
        $binding = $this->connected('the-ticket', self::NONCE);
        $this->start($binding, ['startId' => 'start-1'])->assertCreated();
        ProjectBinding::query()->whereKey($binding->id)->update(['readiness' => 'revoked']);

        $this->start($binding, ['startId' => 'start-1'])->assertForbidden();
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

    public function test_a_new_boot_of_the_relay_starts_nothing_until_it_reported_its_earlier_sessions(): void
    {
        $binding = $this->connected('the-ticket', self::NONCE);
        $this->signedRelayCall(
            $this->relayCredential(self::NONCE),
            "/host/bindings/{$binding->id}/presence",
            [
                'bootId' => 'boot-after-sleep',
                'sequence' => 1,
                'release' => '1.0.0',
                'descriptors' => [],
                'provisioning' => 'succeeded',
                'isTakeover' => true,
                'setupGeneration' => 1,
            ],
            (string) Str::uuid(),
        )->assertOk();

        $refused = $this->start($binding, [])->assertForbidden();

        $this->assertStringContainsString(
            self::EARLIER_SESSIONS,
            (string) $refused->json('message'),
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
