<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Exceptions\AgentContextMissing;
use App\Http\Middleware\Agents\AuthenticateAgent;
use App\Models\StartToken;
use App\Support\AgentContext;
use App\Support\AgentSessions;
use App\Support\Stack\StateTypes;
use App\Support\StartTokens;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Route;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Agents\TestStart;
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
        ])->middleware(AuthenticateAgent::class);
    }

    public function test_a_start_token_authenticates_its_own_agent_and_session(): void
    {
        $start = TestStart::start('read-only-helper');

        $this->callAs($start)->assertOk()->assertExactJson([
            'agent' => $start->agent->id,
            'session' => $start->session->id,
        ]);
    }

    public function test_only_the_hash_of_the_token_is_stored(): void
    {
        $start = TestStart::start();

        $stored = StartToken::query()->sole();

        $this->assertNotSame($start->token, $stored->token_hash);
        $this->assertSame(hash('sha256', $start->token), $stored->token_hash);
    }

    public function test_ids_in_the_headers_or_body_do_not_change_who_is_calling(): void
    {
        $start = TestStart::start();
        $other = TestStart::start();
        $body = json_encode(['agent' => $other->agent->id, 'session' => $other->session->id]) ?: '';

        $this->call('POST', '/testing/agent-context', server: [
            ...$start->serverHeaders($body, target: '/testing/agent-context'),
            'HTTP_X_AGENT_ID' => (string) $other->agent->id,
        ], content: $body)->assertOk()->assertJson(['agent' => $start->agent->id, 'session' => $start->session->id]);
    }

    public function test_a_request_without_a_credential_is_refused(): void
    {
        $start = TestStart::start();
        $headers = $start->serverHeaders(self::BODY, target: '/testing/agent-context');
        unset($headers['HTTP_AUTHORIZATION']);

        $this->call('POST', '/testing/agent-context', server: $headers, content: self::BODY)->assertUnauthorized();
    }

    public function test_an_unknown_credential_is_refused(): void
    {
        $start = TestStart::start();
        $headers = [
            ...$start->serverHeaders(self::BODY, target: '/testing/agent-context'),
            'HTTP_AUTHORIZATION' => 'Bearer not-a-token',
        ];

        $this->call('POST', '/testing/agent-context', server: $headers, content: self::BODY)->assertUnauthorized();
    }

    public function test_a_revoked_credential_is_refused(): void
    {
        $start = TestStart::start();
        new StartTokens()->revoke($start->session);

        $this->callAs($start)->assertUnauthorized()->assertJson(['code' => 'unauthenticated']);
    }

    public function test_the_credential_of_an_ended_session_is_refused(): void
    {
        $start = TestStart::start();
        $this->app->make(AgentSessions::class)->end($start->session);

        $this->callAs($start)->assertUnauthorized()->assertJson(['code' => 'unauthenticated']);
    }

    public function test_a_child_session_names_its_parent(): void
    {
        $start = TestStart::start();

        $child = $this->app->make(AgentSessions::class)->start(
            $start->agent,
            TestSelections::of(),
            TestSelections::requestId(),
            $start->session,
        );

        $this->assertSame($start->session->id, $child->parent_session_id);
    }

    public function test_a_reused_worker_gives_each_request_its_own_agent_and_keeps_the_state_types(): void
    {
        $first = TestStart::start();
        $second = TestStart::start();
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
    private function callAs(TestStart $start): TestResponse
    {
        return $this->call(
            'POST',
            '/testing/agent-context',
            server: $start->serverHeaders(self::BODY, target: '/testing/agent-context'),
            content: self::BODY,
        );
    }
}
