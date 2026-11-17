<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Domain\Agents\Models\LaunchBypass;
use App\Domain\Hooks\LaunchStacks;
use App\Domain\Hooks\Programs\HookProgram;
use App\Domain\Hooks\Programs\OutageReply;
use App\Domain\Hooks\Programs\ProgramReply;
use App\Domain\Hooks\Relay\HookRelay;
use App\Domain\Hooks\Relay\RelaySettings;
use App\Domain\Hooks\StackTransaction;
use App\Domain\Hooks\States\ReadyStateType;
use App\Domain\Hooks\Storage\StackTarget;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

final class HookRelayTest extends TestCase
{
    use RefreshHookDatabase;

    private const TABLES = ['agents', 'agent_sessions', 'launch_credentials', 'launch_bypasses', 'agent_stacks', 'hook_calls', 'links'];

    private const STOP = '{"session_id":"session-1","hook_event_name":"Stop","stop_hook_active":false}';

    private const SHELL = '{"session_id":"session-1","hook_event_name":"PreToolUse","tool_name":"Bash","tool_input":{"command":"git status"}}';

    private TestLaunch $launch;

    private string $bypassLog;

    protected function setUp(): void
    {
        parent::setUp();

        foreach (self::TABLES as $table) {
            DB::table($table)->truncate();
        }
        $this->launch = TestLaunch::start('hooks.main_ready');
        $this->app->make(StackTransaction::class)->run(fn () => $this->app->make(LaunchStacks::class)->open(
            new StackTarget($this->launch->agent->id, $this->launch->session->id),
            ReadyStateType::MainAgent,
        ));
        $this->bypassLog = sys_get_temp_dir().'/hook-relay-bypasses-'.getmypid().'.jsonl';
    }

    protected function tearDown(): void
    {
        if (is_file($this->bypassLog)) {
            unlink($this->bypassLog);
        }
        foreach (self::TABLES as $table) {
            DB::table($table)->truncate();
        }

        parent::tearDown();
    }

    public function test_the_relay_carries_a_signed_call_to_the_endpoint_and_prints_its_reply(): void
    {
        $this->forwardToTheEndpoint();

        $reply = $this->relay(self::STOP);

        $this->assertSame(['{}', '', 0], [$reply->stdout, $reply->stderr, $reply->exitCode]);
        $this->assertSame(1, DB::table('hook_calls')->count());
    }

    public function test_during_an_outage_the_main_agent_goes_on_and_the_bypass_is_logged(): void
    {
        Http::fake(fn () => throw new ConnectionException('The journal is down.'));

        $reply = $this->relay(self::SHELL);

        $this->assertSame('{"hookSpecificOutput":{"hookEventName":"PreToolUse"}}', $reply->stdout);
        $this->assertStringContainsString('"nativeEvent":"PreToolUse","failure":"unreachable"', (string) file_get_contents($this->bypassLog));
    }

    public function test_a_server_error_counts_as_an_outage_too(): void
    {
        Http::fake(['*' => Http::response('', 503)]);

        $this->assertSame('{}', $this->relay(self::STOP)->stdout);
        $this->assertFileExists($this->bypassLog);
    }

    public function test_a_helper_is_refused_during_an_outage_and_logs_nothing(): void
    {
        Http::fake(fn () => throw new ConnectionException('The journal is down.'));

        $reply = $this->relay(self::SHELL, ReadyStateType::ReadOnlyHelper);

        $this->assertStringContainsString(OutageReply::OUTAGE_REASON, $reply->stdout);
        $this->assertFileDoesNotExist($this->bypassLog);
    }

    public function test_a_refused_credential_is_not_an_outage(): void
    {
        $this->forwardToTheEndpoint();

        $reply = $this->relay(self::SHELL, token: 'not-the-launch-token');

        $this->assertSame('deny', json_decode($reply->stdout, true)['hookSpecificOutput']['permissionDecision']);
        $this->assertFileDoesNotExist($this->bypassLog);
    }

    public function test_the_bypasses_are_uploaded_once_the_journal_answers_again(): void
    {
        $journalIsDown = true;
        $this->forwardToTheEndpoint(function () use (&$journalIsDown): void {
            if ($journalIsDown) {
                throw new ConnectionException('The journal is down.');
            }
        });
        $this->relay(self::SHELL);
        $journalIsDown = false;

        $this->relay(self::STOP);

        $this->assertSame(['PreToolUse'], LaunchBypass::query()->pluck('native_event')->all());
        $this->assertSame($this->launch->session->id, LaunchBypass::query()->value('agent_session_id'));
        $this->assertFileDoesNotExist($this->bypassLog);
        $this->assertSame(1, DB::table('hook_calls')->count());
    }

    /**
     * @return array<int, string>
     */
    protected function connectionsToTransact(): array
    {
        return [];
    }

    private function relay(string $payload, ReadyStateType $role = ReadyStateType::MainAgent, ?string $token = null): ProgramReply
    {
        $settings = new RelaySettings('http://journal.test', $token ?? $this->launch->token, $role, $this->bypassLog);

        return $this->app->make(HookRelay::class)->relay(HookProgram::ClaudeCode, $payload, $settings);
    }

    /**
     * Sends each of the relay's requests through the application's own HTTP kernel, so the relay talks to the real endpoint.
     */
    private function forwardToTheEndpoint(?\Closure $beforeEachRequest = null): void
    {
        Http::fake(function (Request $request) use ($beforeEachRequest) {
            if ($beforeEachRequest !== null) {
                $beforeEachRequest();
            }
            $server = [];
            foreach ($request->headers() as $name => $values) {
                $server['HTTP_'.strtoupper(str_replace('-', '_', $name))] = $values[0];
            }
            $server['CONTENT_TYPE'] = 'application/json';
            $this->app->forgetScopedInstances();

            $response = $this->call('POST', (string) parse_url($request->url(), PHP_URL_PATH), server: $server, content: $request->body());

            return Http::response((string) $response->getContent(), $response->getStatusCode());
        });
    }
}
