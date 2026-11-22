<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Exceptions\CredentialRejected;
use App\Models\Agent;
use App\Resolvers\Support\CurrentAgentRuntimes;
use App\Support\ActorIdentity;
use App\Support\CredentialLookup;
use App\Support\StartSessions;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\OpensDriverRuntimes;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * An agent has one current runtime: restarting it fences the older generation while the agent stays active, the
 * resolver answers only the current runtime, and a fenced runtime's credential is refused.
 */
final class ActorRuntimeResolverTest extends TestCase
{
    use OpensDriverRuntimes;
    use RefreshHookDatabase;

    public function test_restarting_fences_the_older_runtime_and_only_the_current_one_resolves(): void
    {
        $agent = Agent::create('Builder', 'main-agent');
        $starts = $this->app->make(StartSessions::class);
        $older = $starts->start($agent, TestSelections::of('claude-code'), TestSelections::requestId());
        $this->openDriverRuntime($older->session);
        $newer = $starts->start($agent->refresh(), TestSelections::of('claude-code'), TestSelections::requestId());
        $this->openDriverRuntime($newer->session);

        $current = $this->app->make(CurrentAgentRuntimes::class)->currentFor(ActorIdentity::of($agent))->get();

        $this->assertSame([$newer->session->id, 2], [$current->target->sessionId, $current->generation]);
        $this->assertFalse($agent->refresh()->isRetired());
        $credentials = $this->app->make(CredentialLookup::class);
        $this->assertSame($newer->session->id, $credentials->sessionFor($newer->token)->id);
        $this->assertThrows(
            fn () => $this->app->make(CredentialLookup::class)->sessionFor($older->token),
            CredentialRejected::class,
        );
    }
}
