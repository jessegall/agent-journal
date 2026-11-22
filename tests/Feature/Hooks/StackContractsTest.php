<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Contracts\AgentStack;
use App\Contracts\StackTransactionRunner;
use App\Contracts\UserStack;
use App\Support\AgentStacks;
use App\Support\StackTransaction;
use App\Support\UserStacks;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * Domains reach the stack through three narrow contracts; each names the private Core class that does the work.
 */
final class StackContractsTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    public function test_each_stack_contract_resolves_to_its_core_implementation(): void
    {
        $this->startTestAgentRequest(1, 10);

        $this->assertInstanceOf(AgentStacks::class, $this->app->make(AgentStack::class));
        $this->assertInstanceOf(UserStacks::class, $this->app->make(UserStack::class));
        $this->assertInstanceOf(StackTransaction::class, $this->app->make(StackTransactionRunner::class));
    }
}
