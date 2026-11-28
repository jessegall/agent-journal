<?php

declare(strict_types=1);

namespace Tests\Unit\AgentRequests;

use App\Api\AgentRequestClient;
use App\Api\SignedCall;
use App\Exceptions\ApiDeadlinePassed;
use App\Exceptions\JournalUnreachable;
use App\Profiles\StartProfilePin;
use App\Recordings\RecordedCall;
use App\Sessions\AgentClientSettings;
use App\Sessions\Exceptions\SessionTokenRefused;
use App\Sessions\Exceptions\StartSettingMissing;
use App\Sessions\SessionTokenSource;
use App\Sessions\StartEnvironment;
use Carbon\CarbonImmutable;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\Support\Recordings\TestAgentApi;
use Tests\TestCase;

/**
 * A prepared signed call is sent unchanged on a retry and answers with any status; the start token is refused
 * when it is missing, a placeholder or reached without HTTPS.
 */
final class PreparedCallTest extends TestCase
{
    private const string UNANSWERED = 'did not answer';

    private const string BODY = '{"jsonrpc":"2.0","id":1,"method":"ping"}';

    private const array PIN = ['JOURNAL_PROFILE' => 'main-agent', 'JOURNAL_PROFILE_REVISION' => '1'];

    public function test_a_transport_retry_sends_a_prepared_call_unchanged(): void
    {
        Http::record();
        $this->journal->agentApi(fn (TestAgentApi $journal) => $journal->playing('claude-code/headless-turn')
            ->withFrame(1, function (AgentClientSettings $settings, RecordedCall $asked): void {
                $client = $this->app->make(AgentRequestClient::class);
                $call = $client->prepare($settings, $asked->path, $asked->body, CarbonImmutable::now()->getTimestamp());
                $deadline = CarbonImmutable::now()->addSeconds(20);
                $headers = ['Mcp-Method' => 'server/discover'];

                $this->assertTrue($client->sendPrepared($call, $headers, $deadline)->isSuccessful());
                $this->assertTrue($client->sendPrepared($call, $headers, $deadline)->isSuccessful());

                $sent = Http::recorded()->map(fn (array $pair) => [
                    $pair[0]->url(),
                    $pair[0]->body(),
                    $pair[0]->header(SignedCall::ID_HEADER),
                    $pair[0]->header(SignedCall::ISSUED_AT_HEADER),
                    $pair[0]->header(SignedCall::SIGNATURE_HEADER),
                    $pair[0]->header('Mcp-Method'),
                ]);
                $this->assertCount(2, $sent);
                $this->assertSame($sent[0], $sent[1]);
                $this->assertSame($asked->body, $sent[0][1]);
                $this->assertSame([$call->signature], $sent[0][4]);
            }));
    }

    public function test_a_500_answer_comes_back_as_status_and_body(): void
    {
        Http::fake(['journal.test/*' => Http::response('{"message":"broken"}', 500)]);
        $client = $this->app->make(AgentRequestClient::class);

        $reply = $client->sendPrepared(
            $client->prepare($this->settings(), '/agent/mcp/v1', self::BODY, CarbonImmutable::now()->getTimestamp()),
            [],
            CarbonImmutable::now()->addSeconds(20),
        );

        $this->assertSame(500, $reply->status);
        $this->assertSame('{"message":"broken"}', $reply->body);
        $this->assertFalse($reply->isSuccessful());
    }

    public function test_an_unreachable_journal_and_a_passed_deadline_are_named(): void
    {
        Http::fake(fn () => throw new ConnectionException('Connection refused'));
        $client = $this->app->make(AgentRequestClient::class);
        $call = $client->prepare(
            $this->settings(),
            '/agent/mcp/v1',
            self::BODY,
            CarbonImmutable::now()->getTimestamp(),
        );

        $this->assertThrows(
            fn () => $client->sendPrepared($call, [], CarbonImmutable::now()->addSeconds(20)),
            JournalUnreachable::class,
            self::UNANSWERED,
        );
        $this->assertThrows(
            fn () => $client->sendPrepared($call, [], CarbonImmutable::now()->subSecond()),
            ApiDeadlinePassed::class,
            'deadline',
        );
    }

    public function test_a_post_meets_the_recorded_journals_answer_to_the_same_frame(): void
    {
        $this->journal->agentApi(fn (TestAgentApi $journal) => $journal
            ->playing('claude-code/terminal-turn')
            ->assertAnswersFrame(1, fn (AgentClientSettings $settings, string $path, string $body) => $this->app
                ->make(AgentRequestClient::class)
                ->post($settings, $path, $body)));
    }

    public function test_post_signs_the_same_envelope_as_before(): void
    {
        Http::record();
        $this->journal->agentApi(fn (TestAgentApi $journal) => $journal->playing('claude-code/terminal-turn')
            ->withFrame(1, function (AgentClientSettings $settings, RecordedCall $asked): void {
                $this->app->make(AgentRequestClient::class)->post($settings, $asked->path, $asked->body);

                Http::assertSent(function (Request $request) use ($settings, $asked): bool {
                    $callId = $request->header(SignedCall::ID_HEADER)[0];
                    $issuedAt = (int) $request->header(SignedCall::ISSUED_AT_HEADER)[0];
                    $signature = SignedCall::agentSignatureFor(
                        $settings->token,
                        'POST',
                        $request->url(),
                        $callId,
                        $issuedAt,
                        $asked->body,
                        $settings->profile,
                    );

                    return $request->body() === $asked->body
                        && $request->header(SignedCall::SIGNATURE_HEADER) === [$signature]
                        && $request->header('Authorization') === ["Bearer {$settings->token}"];
                });
            }));
    }

    public function test_a_placeholder_token_is_refused_before_any_request(): void
    {
        Http::record();

        foreach (['', '${JOURNAL_START_TOKEN}', '<token>'] as $token) {
            $this->assertThrows(
                fn () => $this->credentials(
                    ['JOURNAL_URL' => 'http://127.0.0.1:8000', 'JOURNAL_START_TOKEN' => $token],
                ),
                SessionTokenRefused::class,
            );
        }

        Http::assertNothingSent();
    }

    public function test_a_journal_off_this_machine_needs_https(): void
    {
        $this->assertThrows(
            fn () => $this->credentials(
                ['JOURNAL_URL' => 'http://journal.example', 'JOURNAL_START_TOKEN' => 'start-token'],
            ),
            SessionTokenRefused::class,
        );

        $this->assertSame(
            'https://journal.example',
            $this->credentials(
                ['JOURNAL_URL' => 'https://journal.example/', 'JOURNAL_START_TOKEN' => 'start-token', ...self::PIN],
            )->journalUrl,
        );
        $this->assertSame(
            'http://localhost:8000',
            $this->credentials(
                ['JOURNAL_URL' => 'http://localhost:8000', 'JOURNAL_START_TOKEN' => 'start-token', ...self::PIN],
            )->journalUrl,
        );
    }

    public function test_a_missing_setting_is_named(): void
    {
        $this->assertThrows(
            fn () => $this->credentials(['JOURNAL_URL' => 'https://journal.example']),
            StartSettingMissing::class,
            'JOURNAL_START_TOKEN',
        );
    }

    /**
     * @param  array<string, string>  $environment
     */
    private function credentials(array $environment): AgentClientSettings
    {
        return new SessionTokenSource(new StartEnvironment($environment))->forThisStart();
    }

    private function settings(): AgentClientSettings
    {
        return new AgentClientSettings('http://journal.test', 'start-token', new StartProfilePin('main-agent', 1));
    }
}
