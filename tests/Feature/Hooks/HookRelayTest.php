<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\AgentRequests\Support\SignedCall;
use App\Agents\Models\StartBypass;
use App\Agents\Support\StackTarget;
use App\Hooks\Actions\StartStacks;
use App\Hooks\Enums\CallFailure;
use App\Hooks\Models\HookCall;
use App\Hooks\Programs\OutageReply;
use App\Hooks\Programs\ProgramReply;
use App\Hooks\Relay\CallbackEnvelope;
use App\Hooks\Relay\HookRelay;
use App\Hooks\Relay\PreparationState;
use App\Hooks\Relay\RelaySettings;
use App\Hooks\Support\ProtectedAccounts;
use App\Hooks\Support\StackTransaction;
use App\Programs\Enums\HookProgram;
use Carbon\CarbonImmutable;
use GuzzleHttp\Promise\PromiseInterface;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Hooks\JournalUnreachable;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

final class HookRelayTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'start_tokens',
        'start_bypasses',
        'agent_stacks',
        'hook_calls',
        'links',
        'process_events',
        'part_runs',
        'process_runs',
        'command_requests',
    ];

    private const string STOP = '{"session_id":"session-1","hook_event_name":"Stop","stop_hook_active":false}';

    private const string SHELL = '{"session_id":"session-1","hook_event_name":"PreToolUse","tool_name":"Bash","tool_input":{"command":"git status"}}';

    private const string ACCOUNT_READ = '{"session_id":"session-1","hook_event_name":"PreToolUse","tool_name":"Read",'
        .'"cwd":"/work","tool_input":{"file_path":"../journal/accounts/a/projects/-work/other.jsonl"}}';

    private TestStart $start;

    private string $bypassLog;

    private bool $journalIsDown = false;

    protected function setUp(): void
    {
        parent::setUp();

        $this->start = TestStart::start('main-agent');
        $this->app->make(StackTransaction::class)->run(fn () => $this->app->make(StartStacks::class)->open(
            new StackTarget($this->start->agent->id, $this->start->session->id),
        ));
        $this->bypassLog = sys_get_temp_dir().'/hook-relay-bypasses-'.getmypid().'.jsonl';
        $preparation = new PreparationState(new Filesystem(), $this->bypassLog.'.preparation.json');
        $preparation->openGeneration('generation-1');
        $preparation->prepare('generation-1');
    }

    protected function tearDown(): void
    {
        foreach ([$this->bypassLog, $this->bypassLog.'.preparation.json'] as $file) {
            if (is_file($file)) {
                unlink($file);
            }
        }

        array_map(unlink(...), glob($this->bypassLog.'.pending/*.json') ?: []);
        CarbonImmutable::setTestNow();

        parent::tearDown();
    }

    public function test_the_relay_carries_a_signed_call_to_the_endpoint_and_prints_its_reply(): void
    {
        $this->forwardToTheEndpoint();

        $reply = $this->relay(self::STOP);

        $this->assertSame(['{}', '', 0], [$reply->stdout, $reply->stderr, $reply->exitCode]);
        $this->assertSame(1, HookCall::query()->authorizedFor($this->target())->count());
    }

    public function test_during_an_outage_the_main_agent_goes_on_and_the_bypass_is_logged(): void
    {
        Http::fake(fn () => throw JournalUnreachable::now());

        $reply = $this->relay(self::SHELL);

        $this->assertSame('{"hookSpecificOutput":{"hookEventName":"PreToolUse"}}', $reply->stdout);
        $this->assertStringContainsString(
            '"nativeEvent":"PreToolUse","failure":"unreachable"',
            (string) file_get_contents($this->bypassLog),
        );
    }

    public function test_during_an_outage_a_main_agent_is_still_refused_saved_accounts_and_logs_no_bypass(): void
    {
        Http::fake(fn () => throw JournalUnreachable::now());

        $reply = $this->relay(self::ACCOUNT_READ);

        $this->assertEquals(OutageReply::protectedRefusal('PreToolUse'), $reply);
        $this->assertFileDoesNotExist($this->bypassLog);
    }

    public function test_a_gateway_failure_counts_as_an_outage(): void
    {
        Http::fake(['*' => Http::response('', 502)]);

        $this->assertSame('{}', $this->relay(self::STOP)->stdout);
        $this->assertFileExists($this->bypassLog);
    }

    /**
     * @return iterable<string, array{int, string}>
     */
    public static function serverAnswers(): iterable
    {
        yield 'forbidden' => [403, ''];
        yield 'not found' => [404, ''];
        yield 'unavailable' => [503, ''];
        yield 'a malformed success' => [200, '{"stdout":'];
    }

    #[DataProvider('serverAnswers')]
    public function test_a_server_answer_is_passed_on_as_a_refusal_and_never_bypassed(int $status, string $body): void
    {
        Http::fake(['*' => Http::response($body, $status)]);

        $reply = $this->relay(self::SHELL);

        $this->assertStringContainsString('"permissionDecision":"deny"', $reply->stdout);
        $this->assertFileDoesNotExist($this->bypassLog);
    }

    public function test_a_helper_is_refused_during_an_outage_and_logs_nothing(): void
    {
        Http::fake(fn () => throw JournalUnreachable::now());

        $reply = $this->relay(self::SHELL, passesOutages: false);

        $this->assertStringContainsString(OutageReply::OUTAGE_REASON, $reply->stdout);
        $this->assertFileDoesNotExist($this->bypassLog);
    }

    public function test_a_refused_credential_is_not_an_outage(): void
    {
        $this->forwardToTheEndpoint();

        $reply = $this->relay(self::SHELL, token: 'not-the-start-token');

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

        $this->assertSame(['PreToolUse'], StartBypass::query()->pluck('native_event')->all());
        $this->assertSame($this->start->session->id, StartBypass::query()->value('agent_session_id'));
        $this->assertFileDoesNotExist($this->bypassLog);
        $this->assertSame(1, HookCall::query()->authorizedFor($this->target())->count());
    }

    public function test_a_lost_reply_is_sent_again_as_the_same_call_and_gets_the_recorded_answer(): void
    {
        $sent = [];
        Http::fake(function (Request $request) use (&$sent) {
            $sent[] = [
                $request->header(SignedCall::ID_HEADER)[0],
                $request->header(SignedCall::ISSUED_AT_HEADER)[0],
                hash('sha256', $request->body()),
            ];
            $response = $this->forward($request);

            if (count($sent) === 1) {
                throw new ConnectionException('The reply was lost.');
            }

            return $response;
        });

        $reply = $this->relay(self::STOP);

        $this->assertCount(2, $sent);
        $this->assertSame($sent[0], $sent[1]);
        $this->assertSame(['{}', 0], [$reply->stdout, $reply->exitCode]);
        $this->assertSame(1, HookCall::query()->authorizedFor($this->target())->count());
        $this->assertSame([], glob($this->bypassLog.'.pending/*.json') ?: []);
    }

    public function test_a_retry_past_the_deadline_is_not_sent_and_the_deadline_is_never_extended(): void
    {
        $sent = 0;
        Http::fake(function () use (&$sent) {
            $sent++;
            CarbonImmutable::setTestNow(CarbonImmutable::now()->addSeconds(CallbackEnvelope::DEADLINE_SECONDS + 1));

            throw new ConnectionException('The journal did not answer.');
        });

        $reply = $this->relay(self::STOP);

        $this->assertSame(1, $sent);
        $this->assertEquals(OutageReply::for(CallFailure::Unreachable, true, 'Stop'), $reply);
        $this->assertCount(1, glob($this->bypassLog.'.pending/*.json') ?: []);
    }

    public function test_two_callbacks_with_the_same_text_get_two_envelopes(): void
    {
        $ids = [];
        Http::fake(function (Request $request) use (&$ids) {
            $ids[] = $request->header(SignedCall::ID_HEADER)[0];

            return $this->forward($request);
        });

        $this->relay(self::STOP);
        $this->relay(self::STOP);

        $this->assertCount(2, array_unique($ids));
        $this->assertSame(2, HookCall::query()->authorizedFor($this->target())->count());
        $this->assertSame([], glob($this->bypassLog.'.pending/*.json') ?: []);
    }

    private function relay(string $payload, bool $passesOutages = true, string|null $token = null): ProgramReply
    {
        $settings = new RelaySettings(
            'http://journal.test',
            $token ?? $this->start->token,
            $this->start->pin(),
            $passesOutages,
            $this->bypassLog,
            accounts: new ProtectedAccounts(['/journal/accounts']),
        );

        return $this->app->make(HookRelay::class)->relay(HookProgram::ClaudeCode, $payload, $settings);
    }

    /**
     * Sends each of the relay's requests through the application's own HTTP kernel, so the relay talks to the real
     * endpoint.
     */
    private function forwardToTheEndpoint(): void
    {
        Http::fake(function (Request $request) {
            if ($this->journalIsDown) {
                throw JournalUnreachable::now();
            }

            return $this->forward($request);
        });
    }

    private function forward(Request $request): PromiseInterface
    {
        $server = [];
        foreach ($request->headers() as $name => $values) {
            $server['HTTP_'.strtoupper(str_replace('-', '_', $name))] = $values[0];
        }
        $server['CONTENT_TYPE'] = 'application/json';
        $this->app->forgetScopedInstances();

        $response = $this->call(
            'POST',
            (string) parse_url($request->url(), PHP_URL_PATH),
            server: $server,
            content: $request->body(),
        );

        return Http::response((string) $response->getContent(), $response->getStatusCode());
    }

    private function target(): StackTarget
    {
        return new StackTarget($this->start->agent->id, $this->start->session->id);
    }
}
