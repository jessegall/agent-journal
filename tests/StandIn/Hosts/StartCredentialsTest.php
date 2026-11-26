<?php

declare(strict_types=1);

namespace Tests\StandIn\Hosts;

use App\Enums\Hosts\HostProcessStatus;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsAgainstStandIn;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A process the journal orders opened under host protocol 1 gets the start's credentials in its environment, under
 * the names every entry point reads, and reaches the journal with them: here mcp:relay passes an initialize frame.
 */
#[TestsAgainstStandIn]
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
        'agent_runtimes',
        'driver_requests',
        'session_tokens',
    ];

    private const string INITIALIZE = '{"jsonrpc":"2.0","id":1,"method":"initialize","params":'
        .'{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"stand-in","version":"1"}}}';

    public function test_a_process_opened_by_an_order_reaches_the_journal_with_the_start_token(): void
    {
        $this->chooseActiveAccounts();
        $this->journal->owner()->idleAgent('Relay')->enrollHost('Mac', [base_path()])->runRealHost('Mac');
        $opened = $this->journal->openRuntimeOn('Relay', 'Mac', base_path());
        $answer = tempnam(sys_get_temp_dir(), 'relay-answer-');
        $relay = 'printf "%s\\n" "$0" | php artisan mcp:relay > "$1"';

        $argv = ['sh', '-c', $relay, self::INITIALIZE, $answer];

        $this->journal
            ->openWithStartCredentials('Mac', 'relay', $opened->runtimeId, $argv)
            ->waitForHostProcess('relay', HostProcessStatus::Exited, 30);

        $this->assertStringContainsString('"serverInfo"', (string) file_get_contents($answer));
    }
}
