<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Accounts\Enums\CommandEntry;
use App\Actors\ActorStore;
use App\Agents\Commands\StartAgent\StartAgentCommand;
use App\Agents\Commands\StartOwnedAgent\StartOwnedAgentCommand;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\ExecutionModeType;
use App\Bus\CommandEntrance;
use App\Bus\Contracts\CommandBus;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Projects\Host;
use App\Projects\Commands\RecordHostCallFailure\RecordHostCallFailureCommand;
use App\Sessions\Enums\StartOriginType;
use App\Sessions\OwnerStartRequest;
use App\Sessions\StartReceipt;
use App\Sessions\Values\StartPolicy;
use App\Support\ActorReference;
use App\Values\StartRequest;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\Agents\ServesEveryCombination;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * An owner starts an agent it owns for a piece of work: the agent gets one session, a repeated request answers the
 * same start, and the receipt names how it runs.
 */
#[TestsCommand(StartOwnedAgentCommand::class)]
final class StartOwnedAgentTest extends TestCase
{
    use RefreshHookDatabase;
    use ServesEveryCombination;
    use WithActiveAccount;

    private Agent $researcher;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
        $this->researcher = $this->journal->idleAgent('Researcher', 'read-only-helper')->agentCalled('Researcher');

        $this->chooseActiveAccounts();
        $this->serveEveryCombination();
    }

    public function test_the_owner_starts_its_agent_and_a_repeated_request_answers_the_same_start(): void
    {
        $request = new OwnerStartRequest(
            TestSelections::requestId(),
            ActorReference::of($this->researcher),
            TestActors::record('binders.binder', 1),
            'purpose-1',
            TestSelections::of(),
            ConversationModeType::New,
            StartPolicy::withoutProfile(TestSelections::onHost()),
            DriverType::Headless,
        );
        $bus = $this->app->make(CommandBus::class);

        $first = $bus->run(new StartOwnedAgentCommand($request));
        $again = $bus->run(new StartOwnedAgentCommand($request));

        $this->assertSame([$first->startReference, true, false], [$again->startReference, $first->isNewSession, $again->isNewSession]);
        $this->assertSame(ExecutionModeType::ProtectedHost, $first->executionMode);
        $this->assertSame(1, AgentSession::query()->where('agent_id', $this->researcher->id)->count());
    }

    private function request(int|null $previewRevision = null): StartRequest
    {
        return new StartRequest(
            TestSelections::requestId(),
            $this->researcher->id,
            TestSelections::of(),
            StartOriginType::MainStart,
            null,
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
            driverType: DriverType::Headless,
            previewRevision: $previewRevision,
        );
    }

    /**
     * The journal answers the host's claim with a server error, as the host's own calls record it.
     */
    private function failCallsOf(string $hostId): void
    {
        $failure = new RecordHostCallFailureCommand($hostId, '/host/orders/claim', 500, 'Maximum execution time exceeded');

        $this->app->make(CommandEntrance::class)->through(
            CommandEntry::HostControl,
            fn () => $this->app->make(ActorStore::class)->actAsSystem(
                'host request',
                fn () => $this->app->make(CommandBus::class)->run($failure),
            ),
        );
    }

    private function start(StartRequest $request): StartReceipt
    {
        return $this->app->make(CommandBus::class)->run(new StartAgentCommand($request));
    }
}
