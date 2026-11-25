<?php

declare(strict_types=1);

namespace Tests\Commands\Navigation;

use App\Enums\Navigation\NavigationReason;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\NavigationRequest;
use Tests\Support\Agents\RaisesNavigationRequests;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * A host whose key script stalled on a screen raises a navigation request for it, once for the same operation; a
 * report from an attempt the request has moved past is refused and raises nothing.
 */
final class RaiseNavigationTest extends TestCase
{
    use CommitsHookRows;
    use RaisesNavigationRequests;

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
        'users',
        'inboxes',
        'inbox_members',
        'accounts',
        'active_accounts',
        'session_processes',
    ];

    public function test_a_stalled_key_script_raises_one_request_per_operation(): void
    {
        $this->journal->installInboxes();
        [$host, $opened] = $this->openRuntime();
        $stalled = DriverRequest::query()->findOrFail(
            $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'GPT-6']))->requestId,
        );
        $target = "/host/runtimes/{$stalled->agent_runtime_id}/navigation";

        $first = $this->journal->hostCall(
            $host,
            'POST',
            $target,
            $this->raised($stalled, 'raise-1'),
        )->assertOk()->json();
        $again = $this->journal->hostCall(
            $host,
            'POST',
            $target,
            $this->raised($stalled, 'raise-1'),
        )->assertOk()->json();

        $this->assertEquals($first, $again);
        $this->assertSame(1, NavigationRequest::query()->acrossActors()->count());
    }

    public function test_a_report_from_a_past_attempt_is_refused_and_raises_nothing(): void
    {
        $this->journal->installInboxes();
        [$host, $opened] = $this->openRuntime();
        $stalled = DriverRequest::query()->findOrFail(
            $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'GPT-6']))->requestId,
        );

        $this->journal->hostCall(
            $host,
            'POST',
            "/host/runtimes/{$stalled->agent_runtime_id}/navigation",
            ['attempt' => $stalled->attempt_version + 1] + $this->raised($stalled, 'raise-1'),
        )->assertForbidden();

        $this->assertSame(0, NavigationRequest::query()->acrossActors()->count());
    }

    /**
     * @return array<string, mixed>
     */
    private function raised(DriverRequest $stalled, string $operationKey): array
    {
        return [
            'operation_key' => $operationKey,
            'request_id' => $stalled->id,
            'attempt' => $stalled->attempt_version,
            'step' => 2,
            'reason' => NavigationReason::LabelMissing->value,
            'fingerprint' => 'fp1:'.str_repeat('a', 64),
            'rows' => ['Model: GPT-5', '❯ GPT-6'],
            'highlight' => 1,
            'generation' => 7,
        ];
    }
}
