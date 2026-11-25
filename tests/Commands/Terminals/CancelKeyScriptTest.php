<?php

declare(strict_types=1);

namespace Tests\Commands\Terminals;

use App\Commands\Terminals\CancelKeyScript\CancelKeyScriptCommand;
use App\Enums\Navigation\NavigationStatus;
use Tests\Support\Agents\RaisesNavigationRequests;
use Tests\Support\CommitsHookRows;
use Tests\Support\Engine\RunsEnginePasses;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * Cancelling a key script cancels its request.
 */
#[TestsCommand(CancelKeyScriptCommand::class)]
final class CancelKeyScriptTest extends TestCase
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

    public function test_cancelling_the_key_script_cancels_its_request(): void
    {
        $stalled = $this->stalledScript();
        $navigation = $this->raise($stalled, 'raise-1');

        $this->asOwner(new CancelKeyScriptCommand($stalled->id, $stalled->row_version, 'not needed'));

        $this->assertSame(NavigationStatus::Cancelled, $navigation->fresh()?->status);
    }
}
