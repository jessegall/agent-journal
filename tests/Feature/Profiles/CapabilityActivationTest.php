<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Commands\Agents\StartAgent\StartAgentCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Hosts\DockerImageVerifier;
use App\Contracts\Hosts\HostCapabilities;
use App\Contracts\Sessions\ProfileResolver;
use App\Enums\CapabilityStatusType;
use App\Enums\ConversationModeType;
use App\Enums\DriverType;
use App\Enums\HostCapabilityType;
use App\Enums\StartOriginType;
use App\Exceptions\AccountContainerUnsupported;
use App\Exceptions\ContainerUnavailable;
use App\Models\Agents\Agent;
use App\Support\HostCapability;
use App\Support\HostCapabilityQuery;
use App\Support\ProfileProposal;
use App\Support\RecordIdentity;
use App\Values\ProfileKey;
use App\Values\StartPolicy;
use App\Values\StartRequest;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

final class CapabilityActivationTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;
    use WithActiveAccount;

    private const string PROFILE = 'container-writer';

    public function test_activation_refuses_an_unproven_concrete_combination_before_publishing_the_profile(): void
    {
        $this->startTestUserRequest(1);
        $commands = $this->app->make(CommandBus::class);
        $this->recordCapabilities(CapabilityStatusType::Supported, CapabilityStatusType::Unverified);

        $this->assertThrows(fn () => $commands->run($this->activation()), AccountContainerUnsupported::class);
        $this->assertFalse($this->app->make(ProfileResolver::class)->has(ProfileKey::from(self::PROFILE)));

        $this->recordCapabilities(CapabilityStatusType::Unverified);
        $this->assertThrows(fn () => $commands->run($this->activation()), ContainerUnavailable::class);
        $this->assertFalse($this->app->make(ProfileResolver::class)->has(ProfileKey::from(self::PROFILE)));
    }

    public function test_a_proven_writer_combination_is_admitted_and_withdrawn_evidence_blocks_the_next_start(): void
    {
        $this->chooseActiveAccounts();
        $this->startTestUserRequest(1);
        $this->recordCapabilities(CapabilityStatusType::Supported);
        $this->mock(DockerImageVerifier::class)->shouldReceive('isVerified')->andReturn(true);
        $commands = $this->app->make(CommandBus::class);
        $commands->run($this->activation());
        $profile = $this->app->make(ProfileResolver::class)->snapshotFor(ProfileKey::from(self::PROFILE));
        $policy = $profile->start->freeze((string) $profile->key, $profile->revision);
        $first = $commands->run($this->start($policy));
        $this->assertTrue($first->isNewSession);

        $this->recordCapabilities(CapabilityStatusType::Supported, CapabilityStatusType::Unverified);
        $this->assertThrows(fn () => $commands->run($this->start($policy)), AccountContainerUnsupported::class);
    }

    private function activation(): ActivateProfilesCommand
    {
        return new ActivateProfilesCommand(ProfileProposal::fromConfiguration(['profiles' => [
            self::PROFILE => ['base' => 'writing-helper', 'tier' => 3, 'preferred_driver' => 'claude-code'],
        ]]));
    }

    private function start(StartPolicy $policy): StartAgentCommand
    {
        $actor = Agent::create('Editor', self::PROFILE);

        return new StartAgentCommand(new StartRequest(
            TestSelections::requestId(),
            $actor->id,
            TestSelections::of(),
            StartOriginType::OwnerRequest,
            new RecordIdentity('tests.owner', '01m7wgahp0n7766x1e1ta8ehew'),
            null,
            ConversationModeType::New,
            null,
            $policy,
            driverType: DriverType::Headless,
        ));
    }

    /**
     * Records the container runtime and the account transport as given, and every other capability supported.
     */
    private function recordCapabilities(
        CapabilityStatusType $runtime,
        CapabilityStatusType $account = CapabilityStatusType::Supported,
    ): void {
        $this->mock(HostCapabilities::class)->shouldReceive('capability')->andReturnUsing(
            function (HostCapabilityQuery $query) use ($runtime, $account): HostCapability {
                $status = match ($query->capability) {
                    HostCapabilityType::ContainerRuntime => $runtime,
                    HostCapabilityType::AccountTransport => $account,
                    default => CapabilityStatusType::Supported,
                };

                return new HostCapability($query, $status, 'Test evidence', 'Recorded for the test.');
            },
        );
    }
}
