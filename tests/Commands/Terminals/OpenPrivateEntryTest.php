<?php

declare(strict_types=1);

namespace Tests\Commands\Terminals;

use App\Commands\Terminals\OpenPrivateEntry\OpenPrivateEntryCommand;
use App\Enums\Drivers\DriverOperation;
use App\Exceptions\TerminalControlRefused;
use App\Models\Projects\Host;
use Tests\Support\CommitsHookRows;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\Terminals\TakesTerminalControl;
use Tests\TestCase;

/**
 * The holder opens a private entry at the next sequence, which asks the host to open it; an entry out of sequence is
 * refused.
 */
final class OpenPrivateEntryTest extends TestCase
{
    use CommitsHookRows;
    use OpensTerminalRuntimes;
    use TakesTerminalControl;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'terminal_views',
        'terminal_grants',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
    }

    public function test_a_private_entry_opens_at_the_next_sequence_and_a_gap_is_refused(): void
    {
        $agentId = $this->grantedRuntime()->session->agent_id;

        $this->asOwner(new OpenPrivateEntryCommand($agentId, self::GRANT, 1));

        $this->assertThrows(
            fn () => $this->asOwner(new OpenPrivateEntryCommand($agentId, self::GRANT, 5)),
            TerminalControlRefused::class,
        );
        $this->assertSame(1, $this->sentCount(DriverOperation::OpenPrivateEntry));
    }
}
