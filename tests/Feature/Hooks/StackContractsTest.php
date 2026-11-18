<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Hooks\Actions\AgentStacks;
use App\Hooks\Actions\UserStacks;
use App\Hooks\Contracts\AgentStack;
use App\Hooks\Contracts\StackTransactionRunner;
use App\Hooks\Contracts\UserStack;
use App\Hooks\Support\StackTransaction;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Domains reach the stack through three narrow contracts; each names the private Core class that does the work.
 */
final class StackContractsTest extends TestCase
{
    use StartsAgentRequests;

    public function test_each_stack_contract_resolves_to_its_core_implementation(): void
    {
        $this->startRequestAs(TestIds::of(1), TestIds::of(10));

        $this->assertInstanceOf(AgentStacks::class, $this->app->make(AgentStack::class));
        $this->assertInstanceOf(UserStacks::class, $this->app->make(UserStack::class));
        $this->assertInstanceOf(StackTransaction::class, $this->app->make(StackTransactionRunner::class));
    }
}
