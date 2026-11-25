<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\StartAgent\StartAgentCommand;
use App\Commands\Agents\StartOwnedAgent\StartOwnedAgentCommand;
use App\Commands\Projects\RecordHostCallFailure\RecordHostCallFailureCommand;
use App\Contracts\Bus\CommandBus;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Agents\ConversationModeType;
use App\Enums\Agents\ExecutionModeType;
use App\Enums\Drivers\DriverType;
use App\Enums\Sessions\StartOriginType;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Projects\Host;
use App\Support\ActorIdentity;
use App\Support\ActorStore;
use App\Support\CommandEntrance;
use App\Support\OwnerStartRequest;
use App\Support\StartReceipt;
use App\Values\StartPolicy;
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
            ActorIdentity::of($this->researcher),
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
        $failure = new RecordHostCallFailureCommand($hostId, '/host/claim', 500, 'Maximum execution time exceeded');

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
