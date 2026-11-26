<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\OpenBindingMainRuntime\OpenBindingMainRuntimeCommand;
use App\Commands\Inboxes\InstallInboxes\InstallInboxesCommand;
use App\Contracts\Assignments\AssignmentTransaction;
use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Sessions\ProfileResolver;
use App\Enums\Accounts\CommandEntry;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Models\Projects\ProjectBinding;
use App\Support\ActorReference;
use App\Support\DefaultDrivers;
use App\Support\JournalCommands;
use App\Values\ProfileKey;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A binding's relay opens its main agent's runtime: a start that names no model takes its profile's default, its answer
 * carries the plan its device runs on the owner's terminal, and the server's own main agent stays attached to the main
 * inbox.
 */
#[TestsCommand(OpenBindingMainRuntimeCommand::class)]
final class OpenBindingMainRuntimeTest extends TestCase
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

    public function test_a_start_that_names_no_model_takes_its_profiles_default(): void
    {
        $binding = $this->connected('the-ticket', self::NONCE);

        $started = $this->start($binding, ['model' => 'default'])->assertCreated();

        $profile = $this->app->make(ProfileResolver::class)->snapshotFor(ProfileKey::from('main-agent'));
        $family = $this->app->make(DriverCatalogue::class)->family(DefaultDrivers::CLAUDE_CODE);
        $session = AgentSession::query()->findOrFail($started->json('session_id'));
        $this->assertSame($family->modelAt($profile->preferredTier), $session->model);
    }

    public function test_a_start_answers_the_plan_its_device_runs_on_the_owners_terminal(): void
    {
        $binding = $this->connected('the-ticket', self::NONCE);

        $plan = $this->start($binding, [])->assertCreated()->json('plan');

        $sessionId = AgentSession::query()->sole()->id;
        $settings = json_decode($plan['files'][0]['content'], true, flags: JSON_THROW_ON_ERROR);
        $this->assertSame(
            ['claude', ['--session-id', $sessionId], 'settings.json', $binding->canonical_root, true],
            [
                $plan['argv'][0],
                array_slice($plan['argv'], -2),
                $plan['files'][0]['name'],
                $plan['folder'],
                str_contains(json_encode($settings['hooks'], JSON_THROW_ON_ERROR), '{host:HOOK_COMMAND}'),
            ],
        );
    }

    public function test_a_binding_runtime_leaves_the_servers_main_agent_attached_to_main(): void
    {
        $serverMain = $this->journal->idleAgent('Server main', 'main-agent')->agentCalled('Server main');
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->journal->seatMainAgent($serverMain),
        );
        $binding = $this->connected('the-ticket', self::NONCE);

        $this->start($binding, [])->assertCreated();

        $this->assertSame(
            [ActorReference::of($serverMain)->text()],
            array_map(
                fn (ActorReference $member) => $member->text(),
                InboxMember::resolveAttachedTo([Inbox::findMain()->id], Agent::class),
            ),
        );
        $this->assertTrue(Agent::query()->findOrFail($serverMain->id)->currentRuntime()->isEmpty());
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
