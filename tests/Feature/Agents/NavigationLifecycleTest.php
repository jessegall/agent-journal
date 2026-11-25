<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Enums\Navigation\NavigationStatus;
use App\Models\Agents\AgentRuntime;
use App\Support\DriverRequestEndings;
use Tests\Support\Agents\RaisesNavigationRequests;
use Tests\Support\CommitsHookRows;
use Tests\Support\Engine\RunsEnginePasses;
use Tests\TestCase;

/**
 * Cancelling a key script cancels its navigation request, and a runtime that ends cancels the request of its key
 * script.
 */
final class NavigationLifecycleTest extends TestCase
{
    use CommitsHookRows;
    use RaisesNavigationRequests;
    use RunsEnginePasses;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'navigation_requests',
        'accounts',
        'active_accounts',
        'session_processes',
    ];

    public function test_a_runtime_that_ends_cancels_the_request_of_its_key_script(): void
    {
        $stalled = $this->stalledScript();
        $navigation = $this->raise($stalled, 'raise-1');

        $this->app->make(DriverRequestEndings::class)->closeAfterExit(
            AgentRuntime::query()->findOrFail($stalled->agent_runtime_id),
        );

        $this->assertSame(NavigationStatus::Cancelled, $navigation->fresh()?->status);
    }
}
