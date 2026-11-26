<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\CheckSignIn\CheckSignInCommand;
use App\Commands\Agents\OpenJournalTerminal\OpenJournalTerminalCommand;
use App\Enums\Drivers\DriverType;
use App\Enums\Hosts\HostProcessPurpose;
use App\Enums\Hosts\RestartPolicy;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostProcess;
use App\Models\Sessions\SessionProcess;
use App\Support\OpenedRuntime;
use App\Support\RuntimeScreen;
use App\Support\ScreenRegistration;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
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
        $this->journal->callJournalProcess('terminal', $opened->runtimeId, HostProcessPurpose::AgentTerminal);
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
        $this->journal->callJournalProcess('terminal', $opened->runtimeId, HostProcessPurpose::AgentTerminal);

        $this->journal->printOnHostProcess('terminal', '❯ ready');

        $runtime = AgentRuntime::query()->whereKey($opened->runtimeId)->sole();
        $screen = $this->journal->service(RuntimeScreen::class)->latest(ScreenRegistration::of($runtime));
        $this->journal->assertResult('❯ ready', $screen?->frame->rows[0]->runs[0]->text);
    }

    /**
     * A Claude Code terminal start whose build and sign-in probes passed.
     *
     * @return array{OpenedRuntime, SessionProcess}
     */
    private function provenTerminal(): array
    {
        $this->journal->owner()->chooseActiveAccounts()->showDriverArrangements()->idleAgent('Driven')->enrollHost('Mac', [base_path()]);
        $opened = $this->journal->openRuntimeOn('Driven', 'Mac', base_path(), driverType: DriverType::Terminal);
        $this->journal->passBuildProbe('Driven', $opened->runtimeId);
        $start = $this->journal->startOfSession($opened->sessionId);
        $signedIn = ['loggedIn' => true, 'authMethod' => 'claude.ai', 'configDirectory' => $start->directory];

        $this->journal->asSystem(new CheckSignInCommand(
            $this->journal->hostProcessCalled('Driven-sign-in')->id,
            (string) json_encode($signedIn),
        ));

        return [$opened, $start];
    }
}
