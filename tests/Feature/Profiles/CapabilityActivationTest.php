<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Agents\Commands\StartAgent;
use App\Agents\Contracts\HelperImages;
use App\Agents\Contracts\HostCapabilities;
use App\Agents\Enums\CapabilityStatusType;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\HostCapabilityType;
use App\Agents\Enums\StartOriginType;
use App\Agents\Exceptions\AccountContainerUnsupported;
use App\Agents\Exceptions\ContainerUnavailable;
use App\Agents\Models\Agent;
use App\Agents\Support\HostCapability;
use App\Agents\Support\HostCapabilityQuery;
use App\Agents\Support\StartPolicy;
use App\Agents\Support\StartRequest;
use App\Bus\Contracts\CommandBus;
use App\Profiles\Commands\ActivateProfiles;
use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Support\ProfileProposal;
use App\Profiles\Values\ProfileKey;
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
        $this->mock(HelperImages::class)->shouldReceive('isVerified')->andReturn(true);
        $commands = $this->app->make(CommandBus::class);
        $commands->run($this->activation());
        $profile = $this->app->make(ProfileResolver::class)->snapshotFor(ProfileKey::from(self::PROFILE));
        $policy = new StartPolicy(
            $profile->start->access,
            $profile->start->stopConditions,
            $profile->start->execution,
            $profile->key->key,
            $profile->revision,
            $profile->start->configurationHash(),
        );
        $first = $commands->run($this->start($policy));
        $this->assertTrue($first->newSession);

        $this->app->forgetInstance(HostCapabilities::class);
        $this->assertThrows(fn () => $commands->run($this->start($policy)), AccountContainerUnsupported::class);
    }

    private function activation(): ActivateProfiles
    {
        return new ActivateProfiles(ProfileProposal::fromConfiguration(['profiles' => [
            self::PROFILE => ['base' => 'writing-helper', 'model' => 'opus', 'program' => 'claude-code'],
        ]]));
    }

    private function start(StartPolicy $policy): StartAgent
    {
        $actor = Agent::named('Editor', self::PROFILE);

        return new StartAgent(new StartRequest(
            TestSelections::requestId(),
            $actor->id,
            TestSelections::of(),
            StartOriginType::OwnerRequest,
            'helpers.job 1',
            null,
            ConversationModeType::New,
            null,
            $policy,
        ));
    }

    private function recordCapabilities(CapabilityStatusType $runtime): void
    {
        $this->mock(HostCapabilities::class)->shouldReceive('capability')->andReturnUsing(
            function (HostCapabilityQuery $query) use ($runtime): HostCapability {
                $status = $query->capability === HostCapabilityType::ContainerRuntime
                    ? $runtime : CapabilityStatusType::Supported;

                return new HostCapability($query, $status, 'Test evidence', 'Recorded for the test.');
            },
        );
    }
}
