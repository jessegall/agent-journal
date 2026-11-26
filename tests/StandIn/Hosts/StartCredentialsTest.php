<?php

declare(strict_types=1);

namespace Tests\StandIn\Hosts;

use App\Agents\Drivers\Enums\DriverType;
use App\Hosts\Enums\HostProcessStatus;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsAgainstStandIn;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A process the journal orders opened under host protocol 1 gets the start's credentials in its environment, under
 * the names every entry point reads, and reaches the journal with them: here mcp:relay passes an initialize frame.
 */
#[TestsAgainstStandIn]
#[TimeLimit(seconds: 60, reason: 'It runs the test host, the Docker stand-in and a served journal.')]
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
        .'{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"stand-in","version":"1"}}}';

    public function test_a_process_opened_by_an_order_reaches_the_journal_with_the_start_token(): void
    {
        $this->chooseActiveAccounts();
        $this->journal->owner()->showDriverArrangements()->idleAgent('Relay')->enrollHost('Mac', [base_path()])->runTestHost('Mac');
        $opened = $this->journal->openRuntimeOn('Relay', 'Mac', base_path(), driverType: DriverType::Terminal);
        $answer = tempnam(sys_get_temp_dir(), 'relay-answer-');
        $relay = 'printf "%s\\n" "$0" | php artisan mcp:relay > "$1"';

        $argv = ['sh', '-c', $relay, self::INITIALIZE, $answer];

        $this->journal
            ->openWithStartCredentials('Mac', 'relay', $opened->runtimeId, $argv)
            ->waitForHostProcess('relay', HostProcessStatus::Exited, 30);

        $this->assertStringContainsString('"serverInfo"', (string) file_get_contents($answer));
    }
}
