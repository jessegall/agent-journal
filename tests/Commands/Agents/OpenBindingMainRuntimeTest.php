<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Accounts\Enums\CommandEntry;
use App\Agents\Commands\OpenBindingMainRuntime\OpenBindingMainRuntimeCommand;
use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Enums\SessionProcessStatus;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Bus\JournalCommands;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\HostProcessStatus;
use App\Hosts\Protocol\HostProcessReportType;
use App\Hosts\Protocol\HostProcessType;
use App\Inboxes\Commands\InstallInboxes\InstallInboxesCommand;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Hosts\HostInstruction;
use App\Models\Hosts\HostProcess;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Models\Projects\ProjectBinding;
use App\Sessions\Contracts\ProfileResolver;
use App\Support\ActorReference;
use App\Values\ProfileKey;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestHostProcess;
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
        'host_instructions',
        'host_processes',
        'session_processes',
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

    public function test_a_start_that_names_no_model_takes_its_profiles_default(): void
    {
        $binding = $this->connected('the-ticket', self::NONCE);

        $started = $this->start($binding, ['model' => 'default'])->assertCreated();

        $profile = $this->app->make(ProfileResolver::class)->snapshotFor(ProfileKey::from('main-agent'));
        $family = $this->app->make(DriverCatalogue::class)->family(DefaultDrivers::CLAUDE_CODE);
        $session = AgentSession::query()->findOrFail($started->json('session_id'));
        $this->assertSame($family->modelAt($profile->preferredTier), $session->model);
    }

    public function test_the_binding_opens_a_terminal_runtime_without_ordering_any_host_work(): void
    {
        $binding = $this->connected('the-ticket', self::NONCE);
        $orders = HostInstruction::query()->count();

        $opened = $this->start($binding, [])->assertCreated();

        $runtime = AgentRuntime::query()->findOrFail($opened->json('runtime_id'));
        $this->journal->assertResult(
            [DriverType::ofOwnTerminal(), $orders],
            [$runtime->driver_type, HostInstruction::query()->count()],
        );
    }

    public function test_the_answer_records_an_ordered_terminal_and_grants_its_hooks_access(): void
    {
        $binding = $this->connected('the-ticket', self::NONCE);
        $orders = HostInstruction::query()->count();

        $opened = $this->start($binding, [])->assertCreated();

        $process = HostProcess::query()->findOrFail($opened->json('process_id'));
        $start = $this->journal->startOfSession($opened->json('session_id'));
        $environment = $opened->json('plan.environment');
        $this->journal->assertResult(
            [$binding->host_id, $start->id, HostProcessPurpose::AgentTerminal, HostProcessType::Terminal,
                HostProcessStatus::Ordered, $orders],
            [$process->host_id, $process->session_process_id, $process->purpose, $process->type,
                $process->status, HostInstruction::query()->count()],
        );
        $this->assertContains('JOURNAL_URL={host:JOURNAL_URL}', $environment);
        $this->assertContains('JOURNAL_PROFILE=main-agent', $environment);
        $this->assertMatchesRegularExpression('/^JOURNAL_START_TOKEN=.+$/m', implode("\n", $environment));
        $this->assertMatchesRegularExpression('/^JOURNAL_PROFILE_REVISION=\d+$/m', implode("\n", $environment));
    }

    public function test_retrying_the_same_start_keeps_its_terminal(): void
    {
        $binding = $this->connected('the-ticket', self::NONCE);
        $ask = ['startId' => (string) Str::uuid()];
        $opened = $this->start($binding, $ask)->assertCreated();

        $retried = $this->start($binding, $ask)->assertOk();

        $this->journal->assertResult(
            [$opened->json('runtime_id'), $opened->json('process_id'), 1],
            [$retried->json('runtime_id'), $retried->json('process_id'), HostProcess::query()->count()],
        );
    }

    public function test_the_terminal_that_ran_stops_its_start_on_exit(): void
    {
        $binding = $this->connected('the-ticket', self::NONCE);
        $opened = $this->start($binding, [])->assertCreated();
        $this->journal->nameHostProcess('terminal', $opened->json('process_id'));

        $this->journal->hostProcess('terminal', fn (TestHostProcess $terminal) => $terminal
            ->report(HostProcessReportType::Running));
        $start = $this->journal->startOfSession($opened->json('session_id'));
        $this->journal->hostProcess('terminal', fn (TestHostProcess $terminal) => $terminal
            ->report(HostProcessReportType::Exited, 0));

        $this->journal->assertResult(
            [SessionProcessStatus::Running, SessionProcessStatus::Stopped],
            [$start->status, $start->fresh()->status],
        );
    }

    public function test_a_terminal_that_never_ran_refuses_its_start(): void
    {
        $binding = $this->connected('the-ticket', self::NONCE);
        $opened = $this->start($binding, [])->assertCreated();

        $this->journal->nameHostProcess('terminal', $opened->json('process_id'))
            ->hostProcess('terminal', fn (TestHostProcess $terminal) => $terminal
                ->report(HostProcessReportType::Exited, 1));

        $start = $this->journal->startOfSession($opened->json('session_id'));
        $this->journal->assertResult(
            [SessionProcessStatus::Stopped, 'the process exited with 1'],
            [$start->status, $start->refusal],
        );
    }

    public function test_a_start_answers_the_plan_its_device_runs_on_the_owners_terminal(): void
    {
        $binding = $this->connected('the-ticket', self::NONCE);

        $plan = $this->start($binding, [])->assertCreated()->json('plan');

        $sessionId = AgentSession::query()->sole()->id;
        $settings = json_decode($plan['files'][0]['content'], true, flags: JSON_THROW_ON_ERROR);
        $sealed = '{host:'.$this->journal->driverProfile(DefaultDrivers::CLAUDE_CODE)->executableHostName().'}';
        $this->assertSame(
            [$sealed, [
                '--session-id',
                $sessionId,
            ], 'settings.json', $binding->canonical_root, true],
            [
                $plan['argv'][0],
                array_slice($plan['argv'], -2),
                $plan['files'][0]['name'],
                $plan['folder'],
                str_contains(json_encode($settings['hooks'], JSON_THROW_ON_ERROR), '{host:HOOK_COMMAND}'),
            ],
        );
    }

    public function test_the_owners_terminal_gets_a_home_of_its_own_and_keeps_its_sign_in_between_sessions(): void
    {
        $binding = $this->connected('the-ticket', self::NONCE);

        $plan = $this->start($binding, [])->assertCreated()->json('plan');

        $this->journal->assertResult(
            [['home', 'account'], ['{folder:account}/.credentials.json'], [], true],
            [
                $plan['folders'],
                $plan['kept_files'],
                array_values(array_intersect(['HOME', 'PATH', 'CLAUDE_CONFIG_DIR'], $plan['inherit'])),
                in_array('CLAUDE_CONFIG_DIR={folder:account}', $plan['environment'], true),
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
