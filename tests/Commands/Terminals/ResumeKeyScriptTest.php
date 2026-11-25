<?php

declare(strict_types=1);

namespace Tests\Commands\Terminals;

use App\Commands\Terminals\ResumeKeyScript\ResumeKeyScriptCommand;
use App\Enums\Drivers\RequestProgress;
use App\Models\Accounts\Account;
use App\Models\Drivers\DriverRequest;
use App\Models\Projects\Host;
use App\Support\EnrolledHost;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\OpensPairChats;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
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
    use RunsTrustedCommands;
    use SendsHostCalls;
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

    /**
     * A setting change the host staged waits for a turn and counts as applied only on that turn's evidence: the model
     * its output names confirms a model change, while an effort change, which no output shows, stays unconfirmed.
     */
    /**
     * A host that could not start a turn, such as a prompt its screen did not let in, reports it staged and tries no
     * more: the journal takes the request back and offers it again once its wait has passed.
     */
    /**
     * The host reports a turn's end as it saw it; the journal judges a result marked an error as a failed turn.
     */
    /**
     * A turn that runs past the journal's limit is interrupted on the next engine pass, once, and its runtime held.
     */
    /**
     * The host reports plain facts and the journal chooses the hold: an account that is not signed in, and a stop the
     * host could not prove, each leave the runtime needing attention.
     */
    /**
     * The journal's hold is the only one: an interrupted runtime is offered no new work until a user releases it, and
     * then it is.
     */
    /**
     * A host keeps the runtime of every session it ever ran, so a claim reads only those with a request waiting, and
     * more than a page of their requests when they hold that many.
     */
    /**
     * An idle runtime reports nothing between two turns, so its last report grew stale after a
     * minute and its session read as Status unknown though nothing was wrong.
     */
    /**
     * A page learns that a session's state changed from the host's report itself, so its header
     * never waits for a reload; a beat that only keeps a fresh report fresh says nothing.
     */
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

        $this->hostCall($host, '/host/reports/request', [
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
        $requests = $this->hostCall(
            $host,
            '/host/claim?limit=10&wait=0&watched_version=0',
        )->assertOk()->json('requests');

        return collect($requests)->firstOrFail(fn (array $claimed) => $claimed['requestId'] === $requestId);
    }
}
