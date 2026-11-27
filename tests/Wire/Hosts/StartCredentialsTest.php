<?php

declare(strict_types=1);

namespace Tests\Wire\Hosts;

use App\Agents\Drivers\Enums\DriverType;
use App\Hosts\Enums\HostProcessStatus;
use Tests\Support\Agents\TestAgent;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\OverTheWire;
use Tests\Support\Hosts\TestHost;
use Tests\Support\Hosts\TestHostProcess;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A process the journal orders opened under host protocol 1 gets the start's credentials in its environment, under
 * the names every entry point reads, and reaches the journal with them: here mcp:relay passes an initialize frame.
 */
#[OverTheWire]
#[TimeLimit(seconds: 60, reason: 'It runs the test host, the Docker mock and a served journal.')]
final class StartCredentialsTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

    private const array TABLES = [
        'hosts',
        'host_processes',
        'host_orders',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'accounts',
        'active_accounts',
        'session_processes',
        'inboxes',
        'inbox_members',
        'links',
        'users',
    ];

    private const string INITIALIZE = '{"jsonrpc":"2.0","id":1,"method":"initialize","params":'
        .'{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"mock","version":"1"}}}';

    public function test_a_process_opened_by_an_order_reaches_the_journal_with_the_start_token(): void
    {
        $this->chooseActiveAccounts();
        $answer = tempnam(sys_get_temp_dir(), 'relay-answer-');
        $relay = 'printf "%s\\n" "$0" | php artisan mcp:relay > "$1"';

        $this->journal->owner()
            ->showDriverArrangements()
            ->idleAgent('Relay')
            ->enrollHost('Mac', [base_path()])
            ->runTestHost('Mac', fn (TestHost $mac) => $mac)
            ->withAgent('Relay', fn (TestAgent $agent) => $agent
                ->openRuntime('Mac', base_path(), driverType: DriverType::Terminal))
            ->testHost(fn (TestHost $mac) => $mac
                ->openWithStartCredentials('relay', $this->journal->openedRuntimeOf('Relay')->runtimeId, [
                    'sh',
                    '-c',
                    $relay,
                    self::INITIALIZE,
                    $answer,
                ])
                ->process('relay', fn (TestHostProcess $process) => $process->waitFor(HostProcessStatus::Exited)));

        $this->assertStringContainsString('"serverInfo"', (string) file_get_contents($answer));
    }
}
