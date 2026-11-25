<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Contracts\Files\Files;
use App\Enums\Files\Place;
use App\Enums\Hooks\CallFailure;
use App\Models\Drivers\HookCall;
use App\Models\Starts\StartBypass;
use App\Support\DefaultDrivers;
use App\Support\Drivers\DriverReply;
use App\Support\ProtectedAccounts;
use App\Support\Relay\CallbackEnvelope;
use App\Support\Relay\HookRelay;
use App\Support\Relay\PreparationState;
use App\Support\Relay\RelaySettings;
use App\Support\SignedCall;
use App\Support\StackTransaction;
use App\Support\StartStacks;
use App\Values\AgentText;
use App\Values\FilePath;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use GuzzleHttp\Promise\PromiseInterface;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Hooks\JournalUnreachable;
use Tests\Support\Agents\HostContract;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestText;
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

    private const array COMPARED_HEADERS = ['authorization', 'content-type', 'x-journal-'];

    private const array VARYING_HEADERS = [
        'authorization',
        'x-journal-call-id',
        'x-journal-call-issued-at',
        'x-journal-call-signature',
    ];

    private string $bypassLog;

    private bool $isJournalDown = false;

    protected function setUp(): void
    {
        parent::setUp();

        $this->start = TestStart::start('main-agent');
        $this->app->make(StackTransaction::class)->run(fn () => $this->app->make(StartStacks::class)->open(
            new StackTarget($this->start->agent->id, $this->start->session->id),
        ));
        $this->bypassLog = sys_get_temp_dir().'/hook-relay-bypasses-'.getmypid().'.jsonl';
        $preparation = $this->preparationState();
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

    /**
     * The exchange the Go hook relay (tools/journal-agent/cmd/journal-hook) must hold to: the payload, the start it
     * runs for, each call as it went to the real endpoint with its answer, and the reply printed.
     */
    public function test_the_calls_it_sends_and_the_reply_it_prints_hold_to_the_contract_the_go_relay_shares(): void
    {
        $exchange = ['calls' => [], 'answers' => []];
        Http::fake(function (Request $request) use (&$exchange) {
            $answer = $this->forward($request);
            $response = $answer->wait();
            $exchange['calls'][] = [
                'path' => (string) parse_url($request->url(), PHP_URL_PATH),
                'body' => json_decode($request->body(), true, flags: JSON_THROW_ON_ERROR),
                'headers' => $this->comparedHeaders($request->headers()),
            ];
            $exchange['answers'][] = ['status' => $response->getStatusCode(), 'body' => (string) $response->getBody()];

            return $answer;
        });

        $reply = $this->relay(self::STOP);

        HostContract::of('relays/hook-exchange.json')->assertHolds([
            'payload' => self::STOP,
            'profile' => $this->start->pin()->key,
            'profileRevision' => $this->start->pin()->revision,
            ...$exchange,
            'printed' => ['stdout' => $reply->stdout, 'stderr' => $reply->stderr, 'exitCode' => $reply->exitCode],
        ], []);
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

        $this->assertEquals(TestText::outages()->protectedRefusal('PreToolUse'), $reply);
        $this->assertFileDoesNotExist($this->bypassLog);
    }

    public function test_during_an_outage_a_tool_call_the_relay_cannot_read_is_refused(): void
    {
        Http::fake(fn () => throw JournalUnreachable::now());

        $reply = $this->relay('{"session_id":"session-1","hook_event_name":"PreToolUse","tool_name":"Read","tool_input":"unreadable"}');

        $this->assertEquals(TestText::outages()->protectedRefusal('PreToolUse'), $reply);
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

        $this->assertStringContainsString(TestText::words(AgentText::of('core.drivers.outage')), $reply->stdout);
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
        $this->isJournalDown = true;
        $this->forwardToTheEndpoint();
        $this->relay(self::SHELL);
        $this->isJournalDown = false;

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
        $this->assertEquals(TestText::outages()->for(CallFailure::Unreachable, true, 'Stop'), $reply);
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

    private function relay(string $payload, bool $passesOutages = true, string|null $token = null): DriverReply
    {
        $settings = new RelaySettings(
            'http://journal.test',
            $token ?? $this->start->token,
            $this->start->pin(),
            $passesOutages,
            $this->bypassLog,
            accounts: new ProtectedAccounts(['/journal/accounts']),
        );

        return $this->app->make(HookRelay::class)->relay(DefaultDrivers::CLAUDE_CODE, $payload, $settings);
    }

    /**
     * Sends each of the relay's requests through the application's own HTTP kernel, so the relay talks to the real
     * endpoint.
     */
    private function forwardToTheEndpoint(): void
    {
        Http::fake(function (Request $request) {
            if ($this->isJournalDown) {
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

    /**
     * The headers both relays must send alike, by lowercase name; the token, signature, time and call id differ on
     * every call and are written as varies.
     *
     * @param  array<string, list<string>>  $headers
     * @return array<string, string>
     */
    private function comparedHeaders(array $headers): array
    {
        $compared = [];

        foreach ($headers as $name => $values) {
            $name = strtolower($name);

            $isCompared = array_any(self::COMPARED_HEADERS, fn (string $start) => str_starts_with($name, $start));

            if ($isCompared) {
                $compared[$name] = in_array($name, self::VARYING_HEADERS, true) ? 'varies' : $values[0];
            }
        }

        ksort($compared);

        return $compared;
    }

    private function target(): StackTarget
    {
        return new StackTarget($this->start->agent->id, $this->start->session->id);
    }

    /**
     * The preparation file beside the bypass log, in the hook runtime place the relay points at the log's folder.
     */
    private function preparationState(): PreparationState
    {
        config([Place::HookRuntime->rootSetting() => dirname($this->bypassLog)]);

        return new PreparationState(
            $this->app->make(Files::class),
            FilePath::in(Place::HookRuntime, basename($this->bypassLog).'.preparation.json'),
        );
    }
}
