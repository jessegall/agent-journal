<?php

declare(strict_types=1);

namespace Tests\Commands\Terminals;

use App\Actors\Contracts\CurrentActorSetter;
use App\Bus\Contracts\CommandBus;
use App\Exceptions\ActorNotAllowed;
use App\Models\Agents\Agent;
use App\Models\Drivers\DriverRequest;
use App\Support\ActorReference;
use App\Terminals\Commands\RunKeyScript\RunKeyScriptCommand;
use App\Terminals\Exceptions\KeyScriptRefused;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * The owner runs a key script on an agent's runtime, which queues it as one request; an unknown script and one with a
 * parameter it does not declare are refused.
 */
#[TestsCommand(RunKeyScriptCommand::class)]
final class RunKeyScriptTest extends TestCase
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

    public function test_a_known_script_is_queued_once_and_an_unknown_or_ill_formed_one_is_refused(): void
    {
        [, $opened] = $this->openRuntime();

        $receipt = $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'gpt-6']));

        $request = DriverRequest::query()->findOrFail($receipt->requestId);
        $this->assertSame(['ChangeModel', 2], [$request->script_id, $request->script_version]);
        $this->assertThrows(fn () => $this->asOwner($this->keyScript($opened, 'Nowhere', [])), KeyScriptRefused::class);
        $this->assertThrows(
            fn () => $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'gpt-6', 'colour' => 'red'])),
            KeyScriptRefused::class,
        );
    }

    public function test_an_agent_cannot_run_a_key_script(): void
    {
        [, $opened] = $this->openRuntime();
        $this->app->make(CurrentActorSetter::class)->set(
            ActorReference::forAgent($this->agentIdOf($opened)),
            TestStartAuthority::forAgent($this->agentIdOf($opened)),
        );

        $this->expectException(ActorNotAllowed::class);
        $this->app->make(CommandBus::class)->run($this->keyScript($opened, 'ChangeModel', ['model' => 'gpt-6']));
    }
}
