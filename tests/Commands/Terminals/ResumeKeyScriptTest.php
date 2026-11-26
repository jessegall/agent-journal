<?php

declare(strict_types=1);

namespace Tests\Commands\Terminals;

use App\Commands\Drivers\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Commands\Terminals\ResumeKeyScript\ResumeKeyScriptCommand;
use App\Enums\Drivers\RequestProgress;
use App\Models\Drivers\DriverRequest;
use App\Models\Projects\Host;
use App\Values\ScriptParameter;
use App\Values\ScriptProgress;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A claimed key script carries its script and resumes from the step the host reported.
 */
#[TestsCommand(ResumeKeyScriptCommand::class)]
final class ResumeKeyScriptTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;

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

        $claimed = $this->journal->claimedRequestOnHost($host->hostId, $receipt->requestId);
        $this->assertSame(
            ['ChangeModel', 2, [['name' => 'model', 'value' => 'gpt-6']], null],
            [
                $claimed->script,
                $claimed->scriptVersion,
                array_map(fn (ScriptParameter $parameter) => $parameter->jsonSerialize(), $claimed->scriptParameters),
                $claimed->scriptStep,
            ],
        );

        $this->journal->asSystem(new NotifyRequestProgressCommand(
            $host->hostId,
            $request->id,
            $claimed->attempt,
            RequestProgress::Applying,
            null,
            null,
            new ScriptProgress(2, 7, 'menu login-method, stable'),
        ));
        $request->refresh();
        $this->assertSame([2, 'menu login-method, stable'], [$request->script_step, $request->script_evidence]);

        $this->asOwner(new ResumeKeyScriptCommand($request->id, $request->row_version, 'go on'));

        $this->assertSame(2, $this->journal->claimedRequestOnHost($host->hostId, $request->id)->scriptStep);
    }
}
