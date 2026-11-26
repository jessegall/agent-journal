<?php

declare(strict_types=1);

namespace Tests\Support\Agents;

use App\Access\AccessSettings;
use App\Agents\Commands\StartAgent\StartAgentCommand;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\ExecutionModeType;
use App\Bus\Contracts\CommandBus;
use App\Hosts\Contracts\DockerImageVerifier;
use App\Hosts\Contracts\HostCapabilities;
use App\Hosts\HostCapability;
use App\Hosts\HostCapabilityQuery;
use App\Models\Access\User;
use App\Models\Accounts\Account;
use App\Models\Agents\Agent;
use App\Projects\Enums\CapabilityStatusType;
use App\Sessions\Enums\StartOriginType;
use App\Sessions\StartReceipt;
use App\Sessions\Values\ExecutionPolicy;
use App\Sessions\Values\StartPolicy;
use App\Support\RecordIdentity;
use App\Values\ExecutionBudgets;
use App\Values\StartRequest;
use Tests\Fixtures\Agents\CountingImageVerifier;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\WithActiveAccount;

/**
 * The agents a start test asks to start, an owner's read-only researcher and writing builder, with an active account
 * and every program and model combination served, and the requests it sends to start them.
 */
trait StartsAgents
{
    use ServesEveryCombination;
    use WithActiveAccount;

    private const string IMAGE = 'registry.example/journal-helper@sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

    private Agent $researcher;

    private CountingImageVerifier $images;

    private string $agentId;

    /**
     * The owner, its two idle agents, and the accounts and combinations every start of these tests runs on.
     */
    private function prepareAgentStarts(): void
    {
        $this->journal->owner()->showDriverArrangements();
        $this->researcher = $this->journal->idleAgent('Researcher', 'read-only-helper')->agentCalled('Researcher');
        $this->agentId = $this->journal->idleAgent('Builder', 'writing-helper')->agentCalled('Builder')->id;

        $this->chooseActiveAccounts();
        $this->serveEveryCombination();
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

    private function start(StartRequest $request): StartReceipt
    {
        return $this->app->make(CommandBus::class)->run(new StartAgentCommand($request));
    }

    private function containerRequest(
        string $requestId,
        RecordIdentity $ownerWork = new RecordIdentity('tests.owner', '01m7wgahp0n7766x1e1ta8ehew'),
    ): StartRequest {
        return new StartRequest(
            $requestId,
            $this->agentId,
            TestSelections::of(),
            StartOriginType::OwnerRequest,
            $ownerWork,
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

    private function proveTheHost(): void
    {
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

    private function requestFor(Agent $actor, string $driver): StartRequest
    {
        $image = 'registry.example/journal-helper@sha256:'.str_repeat('a', 64);
        $policy = new ExecutionPolicy(
            ExecutionModeType::RequiredContainer,
            $image,
            'helper-7',
            ExecutionBudgets::defaults(),
            [],
        );

        return new StartRequest(
            TestSelections::requestId(),
            $actor->id,
            TestSelections::of($driver),
            StartOriginType::OwnerRequest,
            new RecordIdentity('tests.owner', '01m7wgahp0n7766x1e1ta8ehew'),
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile($policy),
            driverType: DriverType::Headless,
        );
    }

    private function newAgentContainerRequest(): StartRequest
    {
        $agent = Agent::create('Builder', 'writing-helper', $this->localProject());

        return new StartRequest(
            TestSelections::requestId(),
            $agent->id,
            TestSelections::of(),
            StartOriginType::OwnerRequest,
            new RecordIdentity('tests.owner', '01m7wgahp0n7766x1e1ta8ehew'),
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile($this->policy()),
            driverType: DriverType::Headless,
        );
    }

    private function policy(): ExecutionPolicy
    {
        return new ExecutionPolicy(
            ExecutionModeType::RequiredContainer,
            self::IMAGE,
            'helper-7',
            ExecutionBudgets::defaults(),
            [],
        );
    }

    private function signIn(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->journal->actAsUserId($owner->id);
    }
}
