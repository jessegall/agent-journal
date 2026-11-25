<?php

declare(strict_types=1);

namespace Tests\Commands\Terminals;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\ActorNotAllowed;
use App\Exceptions\KeyScriptRefused;
use App\Models\Agents\Agent;
use App\Models\Drivers\DriverRequest;
use App\Models\Projects\Host;
use App\Support\ActorContext;
use App\Support\EnrolledHost;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * The owner runs a key script on an agent's runtime, which queues it as one request; an unknown script and one with a
 * parameter it does not declare are refused.
 */
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
            ActorContext::forAgent($this->agentIdOf($opened)),
            TestStartAuthority::forAgent($this->agentIdOf($opened)),
        );

        $this->expectException(ActorNotAllowed::class);
        $this->app->make(CommandBus::class)->run($this->keyScript($opened, 'ChangeModel', ['model' => 'gpt-6']));
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
