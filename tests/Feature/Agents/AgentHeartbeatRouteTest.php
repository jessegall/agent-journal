<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Actors\Contracts\ServerClock;
use App\Agents\Actions\LaunchCredentials;
use App\Agents\Models\AgentSession;
use Carbon\CarbonImmutable;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsSignedCalls;
use Tests\Support\TestTimeServerClock;
use Tests\TestCase;

/**
 * Both refresh paths of an agent's presence: the explicit heartbeat route always records a beat, and any other signed
 * call records one only when the stored beat is older than the refresh window. A refused call never writes.
 */
final class AgentHeartbeatRouteTest extends TestCase
{
    use CommitsHookRows;
    use SendsSignedCalls;

    private const array TABLES = ['agents', 'agent_sessions', 'launch_credentials'];

    private const string PING = '/agent/test-ping';

    private TestLaunch $launch;

    private int $beatWrites = 0;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->instance(ServerClock::class, new TestTimeServerClock());
        Route::post(self::PING, fn () => new Response(status: Response::HTTP_NO_CONTENT))->middleware('journal.agent');
        $this->launch = TestLaunch::start();
        DB::listen(function (QueryExecuted $query): void {
            $this->beatWrites += str_starts_with($query->sql, 'update "agent_sessions" set "last_heartbeat_at"') ? 1 : 0;
        });
    }

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();

        parent::tearDown();
    }

    public function test_session_creation_records_no_beat(): void
    {
        $this->assertNull($this->storedSession()->last_heartbeat_at);
    }

    public function test_the_heartbeat_route_records_a_beat_and_answers_no_content(): void
    {
        $this->signed($this->launch, '/agent/heartbeat', [])->assertNoContent();

        $this->assertInstanceOf(CarbonImmutable::class, $this->storedSession()->last_heartbeat_at);
    }

    public function test_a_signed_call_refreshes_a_stale_beat_once_and_not_again_inside_the_window(): void
    {
        $this->signed($this->launch, self::PING, [])->assertNoContent();
        $this->assertInstanceOf(CarbonImmutable::class, $this->storedSession()->last_heartbeat_at);

        CarbonImmutable::setTestNow(CarbonImmutable::now()->addSeconds(5));
        $this->signed($this->launch, self::PING, [])->assertNoContent();
        $this->assertSame(1, $this->beatWrites);

        CarbonImmutable::setTestNow(CarbonImmutable::now()->addSeconds(20));
        $this->signed($this->launch, self::PING, [])->assertNoContent();
        $this->assertSame(2, $this->beatWrites);
    }

    public function test_a_revoked_credential_gets_401_and_no_beat(): void
    {
        new LaunchCredentials()->revoke($this->launch->session);

        $this->signed($this->launch, '/agent/heartbeat', [])->assertUnauthorized();

        $this->assertNull($this->storedSession()->last_heartbeat_at);
    }

    public function test_an_ended_session_gets_401_and_no_beat(): void
    {
        $this->launch->session->endAt(CarbonImmutable::now());

        $this->signed($this->launch, '/agent/heartbeat', [])->assertUnauthorized();

        $this->assertNull($this->storedSession()->last_heartbeat_at);
    }

    public function test_a_bad_signature_gets_401_and_no_beat(): void
    {
        $this->call('POST', '/agent/heartbeat', server: $this->launch->serverHeaders('{}', signingToken: 'not-the-token', target: '/agent/heartbeat'), content: '{}')
            ->assertUnauthorized();

        $this->assertNull($this->storedSession()->last_heartbeat_at);
        $this->assertSame(0, $this->beatWrites);
    }

    private function storedSession(): AgentSession
    {
        return AgentSession::query()->findOrFail($this->launch->session->id);
    }
}
