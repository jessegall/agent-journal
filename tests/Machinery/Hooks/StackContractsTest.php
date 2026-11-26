<?php

declare(strict_types=1);

namespace Tests\Machinery\Hooks;

use App\Contracts\Work\AgentStacks as AgentStacksContract;
use App\Contracts\Work\StackTransactionRunner;
use App\Contracts\Work\UserStack as UserStackContract;
use App\Support\AgentStacks;
use App\Support\StackTransaction;
use App\Support\UserStack;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Domains reach the stack through three narrow contracts; each names the private Core class that does the work.
 */
#[TestsMachinery(StackTransactionRunner::class)]
final class StackContractsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_each_stack_contract_resolves_to_its_core_implementation(): void
    {
        $this->journal->actAsAgentIds(TestIds::of(1), TestIds::of(10));

        $this->assertInstanceOf(AgentStacks::class, $this->app->make(AgentStacksContract::class));
        $this->assertInstanceOf(UserStack::class, $this->app->make(UserStackContract::class));
        $this->assertInstanceOf(StackTransaction::class, $this->app->make(StackTransactionRunner::class));
    }
}
