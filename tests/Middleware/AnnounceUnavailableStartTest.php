<?php

declare(strict_types=1);

namespace Tests\Middleware;

use App\Accounts\Exceptions\AccountUnavailable;
use App\CommandMiddleware\AnnounceUnavailableStart;
use App\Events\Sessions\StartRefusedWithoutAccount;
use App\Models\Accounts\ActiveAccount;
use App\Models\Agents\AgentSession;
use App\Sessions\Enums\StartUnavailableReason;
use Illuminate\Contracts\Events\Dispatcher;
use Tests\Support\Agents\StartsAgents;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsMiddleware;
use Tests\TestCase;

/**
 * Around a start's transaction: a start no account can run is rolled back and announced with its driver and the safe
 * reason, so the owner is told while the agent keeps no session; a start an account runs announces nothing.
 */
#[TestsMiddleware(AnnounceUnavailableStart::class)]
final class AnnounceUnavailableStartTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgents;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'accounts',
        'active_accounts',
        'session_requests',
        'capacity_reservations',
        'session_processes',
        'session_policies',
        'session_tokens',
        'agent_runtimes',
        'driver_requests',
        'agent_stacks',
        'links',
        'command_receipts',
        'settings_records',
        'account_notices',
    ];

    /**
     * @var list<StartRefusedWithoutAccount>
     */
    private array $announced = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->prepareAgentStarts();
        $this->app->make(Dispatcher::class)->listen(
            StartRefusedWithoutAccount::class,
            function (StartRefusedWithoutAccount $announced): void {
                $this->announced[] = $announced;
            },
        );
    }

    public function test_a_start_without_an_account_is_rolled_back_and_announced_with_its_driver_and_reason(): void
    {
        ActiveAccount::query()->withoutGlobalScopes()->where('account_protocol', 'claude-code')->sole()->clear();

        $this->assertThrows(fn () => $this->start($this->request()), AccountUnavailable::class);

        $this->assertSame(
            [[$this->researcher->id, 'claude-code', StartUnavailableReason::NoAccount]],
            array_map(
                fn (StartRefusedWithoutAccount $event) => [$event->agentId, $event->driver, $event->reason],
                $this->announced,
            ),
        );
        $this->assertSame(0, AgentSession::query()->where('agent_id', $this->researcher->id)->count());
    }

    public function test_a_start_an_account_runs_announces_nothing(): void
    {
        $this->start($this->request());

        $this->assertSame([], $this->announced);
    }
}
