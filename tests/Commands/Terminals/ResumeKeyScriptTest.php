<?php

declare(strict_types=1);

namespace Tests\Commands\Terminals;

use App\Commands\Terminals\ResumeKeyScript\ResumeKeyScriptCommand;
use App\Enums\Drivers\RequestProgress;
use App\Models\Drivers\DriverRequest;
use App\Models\Projects\Host;
use App\Support\EnrolledHost;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\OpensPairChats;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

/**
 * A claimed key script carries its script and resumes from the step the host reported.
 */
final class ResumeKeyScriptTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;
    use OpensPairChats;
    use WritesInboxMessages;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'accounts',
        'active_accounts',
        'session_processes',
        'links',
    ];

    public function test_a_claimed_key_script_carries_its_script_and_resumes_from_its_reported_step(): void
    {
        [$host, $opened] = $this->openRuntime();
        $receipt = $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'gpt-6']));
        $request = DriverRequest::query()->findOrFail($receipt->requestId);

        $claimed = $this->claimedScript($host, $receipt->requestId);
        $this->assertSame(
            ['ChangeModel', 2, [['name' => 'model', 'value' => 'gpt-6']], null],
            [$claimed['script'], $claimed['scriptVersion'], $claimed['scriptParameters'], $claimed['scriptStep']],
        );

        $this->journal->hostCall($host, 'POST', '/host/reports/request', [
            'request_id' => $request->id,
            'attempt' => $claimed['attempt'],
            'progress' => RequestProgress::Applying->value,
            'actual_binding' => null,
            'outcome' => null,
            'script' => ['step' => 2, 'generation' => 7, 'evidence' => 'menu login-method, stable'],
        ])->assertSuccessful();
        $request->refresh();
        $this->assertSame([2, 'menu login-method, stable'], [$request->script_step, $request->script_evidence]);

        $this->asOwner(new ResumeKeyScriptCommand($request->id, $request->row_version, 'go on'));

        $this->assertSame(2, $this->claimedScript($host, $request->id)['scriptStep']);
    }

    /**
     * The request as the host's claim hands it out.
     *
     * @return array<string, mixed>
     */
    private function claimedScript(EnrolledHost $host, string $requestId): array
    {
        $requests = $this->journal->hostCall(
            $host,
            'POST',
            '/host/claim?limit=10&wait=0&watched_version=0',
        )->assertOk()->json('requests');

        return collect($requests)->firstOrFail(fn (array $claimed) => $claimed['requestId'] === $requestId);
    }
}
