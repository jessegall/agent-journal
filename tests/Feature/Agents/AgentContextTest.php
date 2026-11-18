<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Actions\AgentSessions;
use App\Agents\Actions\LaunchCredentials;
use App\Agents\Exceptions\AgentContextMissing;
use App\Agents\Lifecycle\AgentLifecycle;
use App\Agents\Models\LaunchCredential;
use App\Agents\Support\AgentContext;
use App\Hooks\Stack\StateTypes;
use App\Http\Middleware\Agents\AuthenticateAgent;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Route;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

final class AgentContextTest extends TestCase
{
    use RefreshHookDatabase;

    private const string BODY = '{"hook":"stop"}';

    protected function setUp(): void
    {
        parent::setUp();

        Route::post('/testing/agent-context', fn (AgentContext $context) => [
            'agent' => $context->agentId,
            'session' => $context->sessionId,
            'role' => $context->role,
        ])->middleware(AuthenticateAgent::class);
    }

    public function test_a_launch_credential_authenticates_its_own_agent_and_session(): void
    {
        $launch = TestLaunch::start('hooks.read_only_helper_ready');

        $this->callAs($launch)->assertOk()->assertExactJson([
            'agent' => $launch->agent->id,
            'session' => $launch->session->id,
            'role' => 'hooks.read_only_helper_ready',
        ]);
    }

    public function test_only_the_hash_of_the_token_is_stored(): void
    {
        $launch = TestLaunch::start();

        $stored = LaunchCredential::query()->sole();

        $this->assertNotSame($launch->token, $stored->token_hash);
        $this->assertSame(hash('sha256', $launch->token), $stored->token_hash);
    }

    public function test_ids_in_the_headers_or_body_do_not_change_who_is_calling(): void
    {
        $launch = TestLaunch::start();
        $other = TestLaunch::start();
        $body = json_encode(['agent' => $other->agent->id, 'session' => $other->session->id]) ?: '';

        $this->call('POST', '/testing/agent-context', server: [
            ...$launch->serverHeaders($body, target: '/testing/agent-context'),
            'HTTP_X_AGENT_ID' => (string) $other->agent->id,
        ], content: $body)->assertOk()->assertJson(['agent' => $launch->agent->id, 'session' => $launch->session->id]);
    }

    public function test_a_request_without_a_credential_is_refused(): void
    {
        $launch = TestLaunch::start();
        $headers = $launch->serverHeaders(self::BODY, target: '/testing/agent-context');
        unset($headers['HTTP_AUTHORIZATION']);

        $this->call('POST', '/testing/agent-context', server: $headers, content: self::BODY)->assertUnauthorized();
    }

    public function test_an_unknown_credential_is_refused(): void
    {
        $launch = TestLaunch::start();
        $headers = [...$launch->serverHeaders(self::BODY, target: '/testing/agent-context'), 'HTTP_AUTHORIZATION' => 'Bearer not-a-token'];

        $this->call('POST', '/testing/agent-context', server: $headers, content: self::BODY)->assertUnauthorized();
    }

    public function test_a_revoked_credential_is_refused(): void
    {
        $launch = TestLaunch::start();
        new LaunchCredentials()->revoke($launch->session);

        $this->callAs($launch)->assertUnauthorized()->assertJson(['code' => 'unauthenticated']);
    }

    public function test_the_credential_of_an_ended_session_is_refused(): void
    {
        $launch = TestLaunch::start();
        new AgentSessions(new AgentLifecycle())->end($launch->session);

        $this->callAs($launch)->assertUnauthorized()->assertJson(['code' => 'unauthenticated']);
    }

    public function test_a_child_session_names_its_parent(): void
    {
        $launch = TestLaunch::start();

        $child = new AgentSessions(new AgentLifecycle())->start($launch->agent, TestSelections::of(), TestSelections::requestId(), $launch->session);

        $this->assertSame($launch->session->id, $child->parent_session_id);
    }

    public function test_a_reused_worker_gives_each_request_its_own_agent_and_keeps_the_state_types(): void
    {
        $first = TestLaunch::start();
        $second = TestLaunch::start();
        $stateTypes = $this->app->make(StateTypes::class);

        $this->callAs($first)->assertJson(['agent' => $first->agent->id]);
        $this->app->forgetScopedInstances();

        try {
            $this->app->make(AgentContext::class);
            $this->fail('The previous request context outlived its request.');
        } catch (AgentContextMissing) {
            $this->assertSame($stateTypes, $this->app->make(StateTypes::class));
        }

        $this->callAs($second)->assertJson(['agent' => $second->agent->id, 'session' => $second->session->id]);
        $this->assertThrows(fn () => $this->app->make(AgentContext::class), AgentContextMissing::class);
    }

    /**
     * @return TestResponse<Response>
     */
    private function callAs(TestLaunch $launch): TestResponse
    {
        return $this->call('POST', '/testing/agent-context', server: $launch->serverHeaders(self::BODY, target: '/testing/agent-context'), content: self::BODY);
    }
}
