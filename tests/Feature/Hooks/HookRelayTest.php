<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Agents\Models\LaunchBypass;
use App\Agents\Support\StackTarget;
use App\Hooks\Actions\LaunchStacks;
use App\Hooks\Enums\HookProgram;
use App\Hooks\Enums\ReadyStateType;
use App\Hooks\Programs\OutageReply;
use App\Hooks\Programs\ProgramReply;
use App\Hooks\Relay\HookRelay;
use App\Hooks\Relay\RelaySettings;
use App\Hooks\Support\StackTransaction;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Fixtures\Hooks\JournalUnreachable;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

final class HookRelayTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['agents', 'agent_sessions', 'launch_credentials', 'launch_bypasses', 'agent_stacks', 'hook_calls', 'links'];

    private const string STOP = '{"session_id":"session-1","hook_event_name":"Stop","stop_hook_active":false}';

    private const string SHELL = '{"session_id":"session-1","hook_event_name":"PreToolUse","tool_name":"Bash","tool_input":{"command":"git status"}}';

    private TestLaunch $launch;

    private string $bypassLog;

    private bool $journalIsDown = false;

    protected function setUp(): void
    {
        parent::setUp();

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
        Http::fake(fn () => throw JournalUnreachable::now());

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
        Http::fake(fn () => throw JournalUnreachable::now());

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
        $this->journalIsDown = true;
        $this->forwardToTheEndpoint();
        $this->relay(self::SHELL);
        $this->journalIsDown = false;

        $this->relay(self::STOP);

        $this->assertSame(['PreToolUse'], LaunchBypass::query()->pluck('native_event')->all());
        $this->assertSame($this->launch->session->id, LaunchBypass::query()->value('agent_session_id'));
        $this->assertFileDoesNotExist($this->bypassLog);
        $this->assertSame(1, DB::table('hook_calls')->count());
    }

    private function relay(string $payload, ReadyStateType $role = ReadyStateType::MainAgent, string|null $token = null): ProgramReply
    {
        $settings = new RelaySettings('http://journal.test', $token ?? $this->launch->token, $role, $this->bypassLog);

        return $this->app->make(HookRelay::class)->relay(HookProgram::ClaudeCode, $payload, $settings);
    }

    /**
     * Sends each of the relay's requests through the application's own HTTP kernel, so the relay talks to the real endpoint.
     */
    private function forwardToTheEndpoint(): void
    {
        Http::fake(function (Request $request) {
            if ($this->journalIsDown) {
                throw JournalUnreachable::now();
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
