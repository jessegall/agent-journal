<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Commands\StartAgent;
use App\Agents\Contracts\ActiveAccountReader;
use App\Agents\Contracts\StartExecutor;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\StartOriginType;
use App\Agents\Exceptions\AccountContainerUnsupported;
use App\Agents\Models\Agent;
use App\Agents\Support\ExecutionBudgets;
use App\Agents\Support\ExecutionPolicy;
use App\Agents\Support\StartPolicy;
use App\Agents\Support\StartRequest;
use App\Bus\Contracts\CommandBus;
use App\Programs\Enums\HookProgram;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

final class HostBridgeTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    public function test_unproven_account_transport_refuses_before_account_selection_or_host_preparation(): void
    {
        $this->startTestUserRequest(1);
        $this->mock(ActiveAccountReader::class)->shouldNotReceive('forStart');
        $this->mock(StartExecutor::class)->shouldNotReceive('start');
        $commands = $this->app->make(CommandBus::class);
        $actor = Agent::create('Builder', 'writing-helper');

        foreach (HookProgram::cases() as $program) {
            $this->assertThrows(
                fn () => $commands->run(new StartAgent($this->requestFor($actor, $program))),
                AccountContainerUnsupported::class,
            );
        }
    }

    private function requestFor(Agent $actor, HookProgram $program): StartRequest
    {
        $image = 'registry.example/journal-helper@sha256:'.str_repeat('a', 64);
        $policy = ExecutionPolicy::make(
            ExecutionModeType::RequiredContainer,
            $image,
            'helper-7',
            ExecutionBudgets::defaults(),
            [],
        );

        return new StartRequest(
            TestSelections::requestId(),
            $actor->id,
            TestSelections::of($program->value),
            StartOriginType::OwnerRequest,
            'helpers.job 1',
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile($policy),
        );
    }
}
