<?php

declare(strict_types=1);

namespace Tests\Support\Hooks;

use App\Actors\Contracts\CurrentActorSetter;
use App\Api\SignedCall;
use App\Sessions\Enums\TransportProfileType;
use App\Sessions\States\Support\SessionStateLifecycle;
use App\Support\ActorReference;
use App\Support\AgentContext;
use App\Support\StackTransaction;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Http\Response;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Recordings\TestScenario;
use Tests\Support\TestStartAuthority;

/**
 * A hook test's started agent, signed for its session with a runtime open and a stack that holds only its ready
 * state, and the native hook calls the test sends as that agent to POST hooks.answer.
 */
trait SendsSignedHooks
{
    private TestStart $start;

    private function recordedHookBody(string $scenario, string $event, int $nth = 1): string
    {
        return new TestScenario($this->journal, $scenario)->hookBody($event, $nth);
    }

    /**
     * Starts the agent the hooks are signed for, with its runtime and its stack of the ready state alone.
     */
    private function signReadyAgent(): void
    {
        config(['journal.processes.runner' => true]);
        $this->start = $this->journal->signedStart('Main agent', 'main-agent');
        $this->start->openRuntime($this->app, $this->journal->enrolledHost()->hostId);
        $this->asStartedAgent(fn () => $this->app->make(StackTransaction::class)->run(
            fn () => $this->app->make(SessionStateLifecycle::class)->open($this->target()),
        ));
    }

    /**
     * The native payload sent to the protocol's hook address as the started agent, from the process generation given.
     *
     * @return TestResponse<Response>
     */
    private function hook(
        string $driver,
        string $body,
        string $callId = 'call-1',
        int|null $generation = null,
    ): TestResponse {
        $this->app->forgetScopedInstances();
        $address = $generation === null ? "/hooks/{$driver}" : "/hooks/{$driver}?generation={$generation}";
        $headers = $this->start->serverHeaders($body, $callId, target: $address);

        return $this->call('POST', $address, server: $headers, content: $body);
    }

    /**
     * The hook's answer to the driver, decoded from the stdout it returned.
     *
     * @return array<string, mixed>
     */
    private function hookOutput(string $driver, string $body, string $callId = 'call-1'): array
    {
        return (array) json_decode((string) $this->hook($driver, $body, $callId)->assertOk()->json('stdout'), true);
    }

    private function asStartedAgent(Closure $work): void
    {
        $this->app->instance(AgentContext::class, new AgentContext(
            $this->start->agent->id,
            $this->start->session->id,
            new SignedCall('setup', CarbonImmutable::now(), hash('sha256', 'setup')),
            null,
            TransportProfileType::Mcp,
        ));
        $this->app->make(CurrentActorSetter::class)->set(
            ActorReference::forAgent($this->start->agent->id),
            TestStartAuthority::forAgent($this->start->agent->id),
        );
        $work();
        $this->app->forgetScopedInstances();
    }

    private function target(): StackTarget
    {
        return new StackTarget($this->start->agent->id, $this->start->session->id);
    }
}
