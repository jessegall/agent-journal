<?php

declare(strict_types=1);

namespace Tests\Commands\Sessions;

use App\Agents\Commands\StartAgent\StartAgentCommand;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\ExecutionModeType;
use App\Bus\Contracts\CommandBus;
use App\Exceptions\ImageUnverified;
use App\Hosts\Contracts\DockerImageVerifier;
use App\Hosts\Contracts\HostCapabilities;
use App\Hosts\HostCapability;
use App\Hosts\HostCapabilityQuery;
use App\Models\Agents\Agent;
use App\Projects\Enums\CapabilityStatusType;
use App\Sessions\Commands\DismissSessionStartOutcome\DismissSessionStartOutcomeCommand;
use App\Sessions\Contracts\AgentDirectory;
use App\Sessions\Enums\StartDisposition;
use App\Sessions\Enums\StartOriginType;
use App\Sessions\Enums\StartRefusalType;
use App\Sessions\SessionStartOutcome;
use App\Sessions\StartReceipt;
use App\Sessions\Values\ExecutionPolicy;
use App\Sessions\Values\StartPolicy;
use App\Support\RecordIdentity;
use App\Values\ExecutionBudgets;
use App\Values\StartRequest;
use Tests\Fixtures\Agents\CountingImageVerifier;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A viewer dismisses an agent's last start outcome, and the dismissal survives a reload for that viewer only.
 */
#[TestsCommand(DismissSessionStartOutcomeCommand::class)]
final class DismissSessionStartOutcomeTest extends TestCase
{
    use RefreshHookDatabase;
    use WithActiveAccount;

    private const string IMAGE = 'registry.example/journal-helper@sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

    private string $ownerId;

    private string $agentId;

    private CountingImageVerifier $images;

    protected function setUp(): void
    {
        parent::setUp();

        $this->chooseActiveAccounts();
        $this->ownerId = $this->journal->owner()->ownerUser()->id;
        $this->agentId = $this->journal->idleAgent('Builder', 'writing-helper')->agentCalled('Builder')->id;
        $this->app->instance(HostCapabilities::class, new class implements HostCapabilities
        {
            public function capability(HostCapabilityQuery $query): HostCapability
            {
                return new HostCapability(
                    $query,
                    CapabilityStatusType::Supported,
                    'docs/x.md',
                    'Proven for this test.',
                );
            }
        });
        $this->images = new CountingImageVerifier();
        $this->app->instance(DockerImageVerifier::class, $this->images);
    }

    public function test_a_dismissal_survives_a_reload_for_that_viewer_only(): void
    {
        $request = $this->refusedStart();

        $this->dismiss($request);

        $this->assertNull($this->outcome());
        $this->assertNull($this->outcome());
        $this->journal->actAsAgentIds($this->agentId, TestSelections::requestId());
        $this->assertSame($request->requestId, $this->outcome()?->requestId);
    }

    public function test_a_sessionless_refusal_is_the_agents_last_start_outcome(): void
    {
        $request = $this->refusedStart();

        $outcome = $this->outcome();

        $this->assertSame(
            [$request->requestId, StartDisposition::Refused, null, StartRefusalType::ImageUnverified->value],
            [$outcome?->requestId, $outcome?->disposition, $outcome?->sessionId, $outcome?->refusalReason],
        );
    }

    public function test_a_later_successful_start_replaces_the_refusal(): void
    {
        $refused = $this->refusedStart();
        $this->dismiss($refused);
        $this->images->verifyEvery();

        $receipt = $this->start($this->containerRequest());

        $outcome = $this->outcome();
        $this->assertSame(
            [StartDisposition::Started, $receipt->sessionId, null],
            [$outcome?->disposition, $outcome?->sessionId, $outcome?->refusalReason],
        );
    }

    private function refusedStart(): StartRequest
    {
        $this->images->refuseEvery();
        $request = $this->containerRequest();
        $this->assertThrows(fn () => $this->start($request), ImageUnverified::class);

        return $request;
    }

    private function dismiss(StartRequest $request): void
    {
        $this->commands()->run(
            new DismissSessionStartOutcomeCommand($this->agentId, $request->requestId, StartDisposition::Refused),
        );
    }

    private function outcome(): SessionStartOutcome|null
    {
        return $this->app->make(AgentDirectory::class)->visibleAgent($this->agentId)->startOutcome;
    }

    private function containerRequest(): StartRequest
    {
        return new StartRequest(
            TestSelections::requestId(),
            $this->agentId,
            TestSelections::of(),
            StartOriginType::OwnerRequest,
            new RecordIdentity('tests.owner', '01m7wgahp0n7766x1e1ta8ehew'),
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(new ExecutionPolicy(
                ExecutionModeType::RequiredContainer,
                self::IMAGE,
                'helper-7',
                ExecutionBudgets::defaults(),
                [],
            )),
            driverType: DriverType::Headless,
        );
    }

    private function start(StartRequest $request): StartReceipt
    {
        return $this->commands()->run(new StartAgentCommand($request));
    }

    private function commands(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
