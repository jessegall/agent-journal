<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\CheckSignIn\CheckSignInCommand;
use App\Agents\Commands\OpenJournalTerminal\OpenJournalTerminalCommand;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Drivers\Work\HeadlessStarts;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\RestartPolicy;
use App\Hosts\Protocol\HostProtocol;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostProcess;
use App\Models\Sessions\SessionProcess;
use App\Sessions\OpenedRuntime;
use App\Terminals\RuntimeScreen;
use App\Terminals\ScreenRegistration;
use Tests\Support\Agents\TestAgent;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestHost;
use Tests\Support\Hosts\TestHostProcess;
use Tests\TestCase;

/**
 * A Claude Code terminal start is claimed and probed by the journal, and once its sign-in is proven the journal opens
 * its terminal, healed on a crash, for its driver worker to type into; a second open makes nothing.
 */
#[TestsCommand(OpenJournalTerminalCommand::class)]
final class OpenJournalTerminalTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'hosts', 'host_processes', 'host_orders', 'agents', 'agent_sessions', 'session_tokens', 'agent_stacks',
        'hook_calls', 'agent_runtimes', 'driver_requests', 'driver_turns', 'accounts', 'active_accounts',
        'session_processes', 'session_requests', 'inboxes', 'inbox_members', 'links', 'users',
    ];

    public function test_a_proven_claude_terminal_start_opens_its_terminal_once(): void
    {
        [$opened, $start] = $this->provenTerminal();

        $terminal = HostProcess::query()
            ->where('session_process_id', $start->id)
            ->where('purpose', HostProcessPurpose::AgentTerminal)
            ->sole();
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->nameProcess('terminal', HostProcessPurpose::AgentTerminal));
        [$open] = $this->journal->hostOrdersOf('terminal');
        $this->journal->assertResult(
            [RestartPolicy::OnCrash->value, null],
            [
                $this->journal->payloadOf($open)['restart'],
                $this->journal->asSystem(new OpenJournalTerminalCommand($opened->runtimeId)),
            ],
        );
        $this->journal->assertResult($terminal->id, $this->journal->hostProcessCalled('terminal')->id);
    }

    public function test_what_the_terminal_shows_reaches_the_terminal_page(): void
    {
        [$opened] = $this->provenTerminal();
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->nameProcess('terminal', HostProcessPurpose::AgentTerminal));

        $this->journal->hostProcess('terminal', fn (TestHostProcess $terminal) => $terminal->print('❯ ready'));

        $runtime = AgentRuntime::query()->whereKey($opened->runtimeId)->sole();
        $screen = $this->journal->service(RuntimeScreen::class)->latest(ScreenRegistration::of($runtime));
        $this->journal->assertResult('❯ ready', $screen?->frame->rows[0]->runs[0]->text);
    }

    public function test_a_contained_terminal_names_nothing_of_the_host_and_reaches_the_journal_at_the_session_address(): void
    {
        $this->journal
            ->owner()
            ->chooseActiveAccounts()
            ->showDriverArrangements()
            ->arrangeContainedJournal()
            ->idleAgent('Driven')
            ->enrollContainedHost('Box', [base_path()]);
        $this->proveTerminalOn('Box');
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->nameProcess('terminal', HostProcessPurpose::AgentTerminal));

        [$open] = $this->journal->hostOrdersOf('terminal');
        $plan = $this->journal->payloadOf($open);
        $refusedFieldsSet = array_filter(array_intersect_key($plan, array_flip(HostProtocol::CONTAINED_REFUSED_FIELDS)));
        $this->journal->assertResult([[], false], [$refusedFieldsSet, str_contains((string) json_encode($plan), '{host:')]);
        $this->journal->assertResult(
            ['JOURNAL_URL='.TestHost::SESSION_JOURNAL_URL],
            array_values(array_filter(
                $this->journal->payloadOf($open)['environment'],
                fn (string $variable) => str_starts_with($variable, 'JOURNAL_URL='),
            )),
        );
    }

    public function test_a_contained_terminal_runs_its_hooks_from_its_managed_settings_with_their_reply_file(): void
    {
        $this->journal
            ->owner()
            ->chooseActiveAccounts()
            ->showDriverArrangements()
            ->arrangeContainedJournal()
            ->idleAgent('Driven')
            ->enrollContainedHost('Box', [base_path()]);
        $this->proveTerminalOn('Box');
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->nameProcess('terminal', HostProcessPurpose::AgentTerminal));

        [$open] = $this->journal->hostOrdersOf('terminal');
        $files = array_column($this->journal->payloadOf($open)['files'], null, 'name');
        $managed = json_decode($files['managed-settings.json']['content'], true, flags: JSON_THROW_ON_ERROR);
        $settings = json_decode($files['settings.json']['content'], true, flags: JSON_THROW_ON_ERROR);

        $this->journal->assertResult(
            [true, $settings['hooks']['SessionStart'], '/opt/journal/bin/journal-hook claude-code {folder:files}/hook-replies.json'],
            [
                $files['managed-settings.json']['template'],
                $managed['hooks']['SessionStart'],
                $managed['hooks']['SessionStart'][0]['hooks'][0]['command'],
            ],
        );
    }

    /**
     * A Claude Code terminal start on a host that runs agents itself, whose build and sign-in probes passed.
     *
     * @return array{OpenedRuntime, SessionProcess}
     */
    private function provenTerminal(): array
    {
        $this->journal
            ->owner()
            ->chooseActiveAccounts()
            ->showDriverArrangements()
            ->idleAgent('Driven')
            ->enrollHost('Mac', [base_path()]);

        return $this->proveTerminalOn('Mac');
    }

    /**
     * Opens the agent's terminal start on the host named and passes its build and sign-in probes.
     *
     * @return array{OpenedRuntime, SessionProcess}
     */
    private function proveTerminalOn(string $hostName): array
    {
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->openRuntime($hostName, base_path(), driverType: DriverType::Terminal));
        $opened = $this->journal->openedRuntimeOf('Driven');
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven->passBuildProbe('Driven'));
        $start = $this->journal->startOfSession($opened->sessionId);
        $runtime = AgentRuntime::query()->whereKey($opened->runtimeId)->sole();
        $folder = $this->journal->service(HeadlessStarts::class)->accountFolderSeenBy($runtime, $start);
        $signedIn = ['loggedIn' => true, 'authMethod' => 'claude.ai', 'configDirectory' => $folder];

        $this->journal->asSystem(new CheckSignInCommand(
            $this->journal->hostProcessCalled('Driven-sign-in')->id,
            (string) json_encode($signedIn),
        ));

        return [$opened, $start];
    }
}
