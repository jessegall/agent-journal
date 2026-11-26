<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Commands\Agents\StartAgent\StartAgentCommand;
use App\Commands\Projects\RecordHostCallFailure\RecordHostCallFailureCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Sessions\StartHeartbeats;
use App\Contracts\Time\ServerClock;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Agents\ConversationModeType;
use App\Enums\Drivers\DriverType;
use App\Enums\Sessions\SessionStatus;
use App\Enums\Sessions\StartOriginType;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Projects\Host;
use App\Support\ActorStore;
use App\Support\CommandEntrance;
use App\Support\StartReceipt;
use App\Values\StartPolicy;
use App\Values\StartRequest;
use Carbon\CarbonImmutable;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\Agents\ServesEveryCombination;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\FixedServerClock;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A start while every host fails waits past the presence window and ends after half an hour.
 */
#[TestsCommand(RecordHostCallFailureCommand::class)]
final class RecordHostCallFailureTest extends TestCase
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

    public function test_a_start_while_every_host_fails_waits_past_the_presence_window_and_ends_after_half_an_hour(): void
    {
        $receipt = $this->start($this->request());
        Host::query()->pluck('id')->each(fn (string $hostId) => $this->failCallsOf($hostId));

        $this->app->instance(ServerClock::class, new FixedServerClock(CarbonImmutable::now()->addSeconds(121)));
        $this->app->make(StartHeartbeats::class)->markSilentStarts();
        $hasWaited = AgentSession::query()->findOrFail($receipt->sessionId)->isActive();

        $this->app->instance(ServerClock::class, new FixedServerClock(CarbonImmutable::now()->addMinutes(31)));
        $this->app->make(StartHeartbeats::class)->markSilentStarts();

        $this->assertSame(
            [true, SessionStatus::Ended],
            [$hasWaited, AgentSession::query()->findOrFail($receipt->sessionId)->status],
        );
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
            driverType: DriverType::Terminal,
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
