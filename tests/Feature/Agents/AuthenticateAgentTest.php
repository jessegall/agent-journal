<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Exceptions\AgentContextMissing;
use App\Support\AgentContext;
use App\Support\AgentSessions;
use App\Support\StartTokens;
use Carbon\CarbonImmutable;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsSignedCalls;
use Tests\TestCase;

/**
 * Every refused agent call gets one structured unauthenticated answer, and no agent context outlives its request.
 */
final class AuthenticateAgentTest extends TestCase
{
    use CommitsHookRows;
    use SendsSignedCalls;

    private const array TABLES = ['agents', 'agent_sessions', 'session_tokens'];

    private const array UNAUTHENTICATED = [
        'code' => 'unauthenticated',
        'message' => 'The call could not be authenticated with this start token.',
    ];

    public function test_an_unknown_credential_gets_the_unauthenticated_body(): void
    {
        $start = TestStart::start();
        $content = '{}';
        $headers = $start->serverHeaders($content, signingToken: 'not-the-token', target: '/agent/heartbeat');
        $headers['HTTP_AUTHORIZATION'] = 'Bearer not-a-start-token';

        $this->call(
            'POST',
            '/agent/heartbeat',
            server: $headers,
            content: $content,
        )->assertUnauthorized()->assertExactJson(self::UNAUTHENTICATED);
    }

    public function test_a_revoked_credential_gets_the_unauthenticated_body(): void
    {
        $start = TestStart::start();
        new StartTokens()->revoke($start->session);

        $this->signed(
            $start,
            '/agent/heartbeat',
            ['request_key' => bin2hex(random_bytes(8))],
        )->assertUnauthorized()->assertExactJson(self::UNAUTHENTICATED);
    }

    public function test_an_ended_session_gets_the_unauthenticated_body(): void
    {
        $start = TestStart::start();
        $this->app->make(AgentSessions::class)->end($start->session);

        $this->signed(
            $start,
            '/agent/heartbeat',
            ['request_key' => bin2hex(random_bytes(8))],
        )->assertUnauthorized()->assertExactJson(self::UNAUTHENTICATED);
    }

    public function test_a_retired_agent_gets_the_unauthenticated_body(): void
    {
        $start = TestStart::start();
        $start->agent->retireAt(CarbonImmutable::now());

        $this->signed(
            $start,
            '/agent/heartbeat',
            ['request_key' => bin2hex(random_bytes(8))],
        )->assertUnauthorized()->assertExactJson(self::UNAUTHENTICATED)->assertDontSee($start->token);
    }

    public function test_after_a_request_the_container_no_longer_resolves_its_agent_context(): void
    {
        $start = TestStart::start();

        $this->signed($start, '/agent/heartbeat', ['request_key' => bin2hex(random_bytes(8))])->assertSuccessful();

        $this->assertThrows(fn () => $this->app->make(AgentContext::class), AgentContextMissing::class);
    }
}
