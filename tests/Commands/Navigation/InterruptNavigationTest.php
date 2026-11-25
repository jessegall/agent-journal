<?php

declare(strict_types=1);

namespace Tests\Commands\Navigation;

use App\Commands\Navigation\InterruptNavigation\InterruptNavigationCommand;
use App\Enums\Drivers\HoldReason;
use App\Enums\Navigation\NavigationStatus;
use App\Models\Drivers\DriverRequest;
use Tests\Support\Agents\RaisesNavigationRequests;
use Tests\Support\CommitsHookRows;
use Tests\Support\Engine\RunsEnginePasses;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * The host's report that the user took over interrupts the request once and holds its key script for attention.
 */
#[TestsCommand(InterruptNavigationCommand::class)]
final class InterruptNavigationTest extends TestCase
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

    public function test_the_hosts_report_that_the_user_took_over_interrupts_the_request_once(): void
    {
        [$host, $opened] = $this->openRuntime();
        $receipt = $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'GPT-6']));
        $stalled = DriverRequest::query()->with('runtime')->findOrFail($receipt->requestId);
        $navigation = $this->raise($stalled, 'raise-1');

        $this->journal->hostCall($host, 'POST', "/host/navigation/{$navigation->id}/interrupt")->assertNoContent();
        $this->journal->hostCall($host, 'POST', "/host/navigation/{$navigation->id}/interrupt")->assertNoContent();

        $this->assertSame(NavigationStatus::Interrupted, $navigation->fresh()?->status);
        $this->assertSame(HoldReason::NeedsAttention, $stalled->fresh()?->hold_reason);
        $this->assertTrue($stalled->refresh()->isStoppedKeyScript());
    }
}
