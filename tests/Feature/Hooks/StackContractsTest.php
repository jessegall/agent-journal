<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Core\Hooks\AgentStacks;
use App\Core\Hooks\Contracts\AgentStack;
use App\Core\Hooks\Contracts\PersonStack;
use App\Core\Hooks\Contracts\StackWork;
use App\Core\Hooks\PersonStacks;
use App\Core\Hooks\StackTransaction;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * Domains reach the stack through three narrow contracts; each names the private Core class that does the work.
 */
final class StackContractsTest extends TestCase
{
    use StartsAgentRequests;

    public function test_each_stack_contract_resolves_to_its_core_implementation(): void
    {
        $this->startRequestAs(1, 10);

        $this->assertInstanceOf(AgentStacks::class, $this->app->make(AgentStack::class));
        $this->assertInstanceOf(PersonStacks::class, $this->app->make(PersonStack::class));
        $this->assertInstanceOf(StackTransaction::class, $this->app->make(StackWork::class));
    }
}
