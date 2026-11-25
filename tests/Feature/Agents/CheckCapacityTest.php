<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Enums\ExecutionModeType;
use App\Models\Agents\Agent;
use App\Models\Starts\CapacityReservation;
use App\Values\ExecutionBudgets;
use App\Values\HostCapacity;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * Check capacity reads whether a start with the chosen placement and budgets would fit the host now, names the
 * resource it lacks in the capacity refusal's words, and reserves nothing.
 */
final class CheckCapacityTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    private User $owner;

    private Agent $agent;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->startUserRequestAs($this->owner->id);
        $this->agent = Agent::create('Builder', 'writing-helper');
        $budgets = ExecutionBudgets::defaults();
        $room = new HostCapacity($budgets->cpuCores, $budgets->memoryBytes, $budgets->workspaceBytes);
        $this->app->instance(HostCapacity::class, $room);
        CapacityReservation::create('start-held', $budgets, $room);
    }

    public function test_a_container_start_that_does_not_fit_names_the_resource_and_reserves_nothing(): void
    {
        $this->actingAs($this->owner)
            ->getJson(route('web.capacity', [
                'agent' => $this->agent->id,
                'mode' => ExecutionModeType::RequiredContainer->value,
            ]))
            ->assertOk()
            ->assertExactJson([
                'fits' => false,
                'resource' => 'cpu',
                'explanation' => 'The host lacks the required CPU.',
                'remedy' => 'Check capacity',
            ]);

        $this->assertSame(1, CapacityReservation::query()->count());
    }

    public function test_a_start_on_the_host_is_not_held_to_container_capacity(): void
    {
        $this->actingAs($this->owner)
            ->getJson(route('web.capacity', [
                'agent' => $this->agent->id,
                'mode' => ExecutionModeType::ProtectedHost->value,
            ]))
            ->assertOk()
            ->assertExactJson(['fits' => true]);
    }
}
