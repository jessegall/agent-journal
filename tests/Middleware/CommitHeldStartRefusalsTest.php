<?php

declare(strict_types=1);

namespace Tests\Middleware;

use App\Accounts\Exceptions\AccountUnavailable;
use App\Agents\Commands\StartOwnedAgent\StartOwnedAgentCommand;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Enums\ConversationModeType;
use App\Bus\Contracts\CommandBus;
use App\CommandMiddleware\CommitHeldStartRefusals;
use App\Exceptions\StartRefusalReplayed;
use App\Models\Accounts\ActiveAccount;
use App\Models\Agents\AgentSession;
use App\Models\Sessions\SessionRequest;
use App\Sessions\Enums\StartDisposition;
use App\Sessions\OwnerStartRequest;
use App\Sessions\Values\StartPolicy;
use App\Support\ActorReference;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\Agents\StartsAgents;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsMiddleware;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * Around the outermost command's transaction: a start refused inside another command rolls back with it, and its
 * refusal is kept on its record once that rollback is done, so a replay of its request id answers with the receipt.
 */
#[TestsMiddleware(CommitHeldStartRefusals::class)]
final class CommitHeldStartRefusalsTest extends TestCase
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

    protected function setUp(): void
    {
        parent::setUp();

        $this->prepareAgentStarts();
    }

    public function test_a_start_refused_inside_another_command_keeps_its_refusal_after_the_rollback(): void
    {
        ActiveAccount::query()->withoutGlobalScopes()->where('account_protocol', 'claude-code')->sole()->clear();
        $command = new StartOwnedAgentCommand($this->ownerRequest());
        $bus = $this->app->make(CommandBus::class);

        $this->assertThrows(fn () => $bus->run($command), AccountUnavailable::class);

        $record = SessionRequest::query()->where('request_id', $command->request->requestId)->sole();
        $this->assertSame(StartDisposition::Refused, $record->disposition);
        $this->assertSame(0, AgentSession::query()->where('agent_id', $this->researcher->id)->count());
        $this->assertThrows(fn () => $bus->run($command), StartRefusalReplayed::class);
    }

    private function ownerRequest(): OwnerStartRequest
    {
        return new OwnerStartRequest(
            TestSelections::requestId(),
            ActorReference::of($this->researcher),
            TestActors::record('binders.binder', 1),
            'purpose-1',
            TestSelections::of(),
            ConversationModeType::New,
            StartPolicy::withoutProfile(TestSelections::onHost()),
            DriverType::Headless,
        );
    }
}
