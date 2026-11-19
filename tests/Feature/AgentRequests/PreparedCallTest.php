<?php

declare(strict_types=1);

namespace Tests\Feature\AgentRequests;

use App\AgentRequests\Exceptions\CallDeadlinePassed;
use App\AgentRequests\Exceptions\JournalUnreachable;
use App\AgentRequests\Exceptions\LaunchCredentialRefused;
use App\AgentRequests\Exceptions\LaunchSettingMissing;
use App\AgentRequests\Support\AgentClientSettings;
use App\AgentRequests\Support\AgentRequestClient;
use App\AgentRequests\Support\EnvironmentCredentialSource;
use App\AgentRequests\Support\LaunchProfilePin;
use App\AgentRequests\Support\SignedCall;
use Carbon\CarbonImmutable;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/**
 * A prepared signed call is sent unchanged on a retry and answers with any status; the launch credential is refused
 * when it is missing, a placeholder or reached without HTTPS.
 */
final class PreparedCallTest extends TestCase
{
    private const string BODY = '{"jsonrpc":"2.0","id":1,"method":"ping"}';

    private const array PIN = ['JOURNAL_PROFILE' => 'main-agent', 'JOURNAL_PROFILE_REVISION' => '1'];

    public function test_a_transport_retry_sends_a_prepared_call_unchanged(): void
    {
        Http::fake(['journal.test/*' => Http::sequence()->pushStatus(502)->push(['ok' => true])]);
        $client = $this->app->make(AgentRequestClient::class);
        $call = $client->prepare(
            $this->settings(),
            '/agent/mcp/v1',
            self::BODY,
            CarbonImmutable::now()->getTimestamp(),
        );
        $deadline = CarbonImmutable::now()->addSeconds(20);

        $client->sendPrepared($call, ['Mcp-Method' => 'ping'], $deadline);
        $client->sendPrepared($call, ['Mcp-Method' => 'ping'], $deadline);

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
        $this->assertSame(self::BODY, $sent[0][1]);
        $this->assertSame([$call->signature], $sent[0][4]);
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
            'did not answer',
        );
        $this->assertThrows(
            fn () => $client->sendPrepared($call, [], CarbonImmutable::now()->subSecond()),
            CallDeadlinePassed::class,
            'deadline',
        );
    }

    public function test_post_signs_the_same_envelope_as_before(): void
    {
        Http::fake(['journal.test/*' => Http::response(['ok' => true])]);

        $this->app->make(AgentRequestClient::class)->post($this->settings(), '/hooks/claude', self::BODY);

        Http::assertSent(function (Request $request): bool {
            $callId = $request->header(SignedCall::ID_HEADER)[0];
            $issuedAt = (int) $request->header(SignedCall::ISSUED_AT_HEADER)[0];
            $pin = new LaunchProfilePin('main-agent', 1);
            $signature = SignedCall::agentSignatureFor(
                'launch-token',
                'POST',
                $request->url(),
                $callId,
                $issuedAt,
                self::BODY,
                $pin,
            );

            return $request->body() === self::BODY
                && $request->header(SignedCall::SIGNATURE_HEADER) === [$signature]
                && $request->header('Authorization') === ['Bearer launch-token'];
        });
    }

    public function test_a_placeholder_token_is_refused_before_any_request(): void
    {
        Http::fake();

        foreach (['', '${JOURNAL_LAUNCH_TOKEN}', '<token>'] as $token) {
            $this->assertThrows(
                fn () => new EnvironmentCredentialSource(
                    ['JOURNAL_URL' => 'http://127.0.0.1:8000', 'JOURNAL_LAUNCH_TOKEN' => $token],
                )->forThisLaunch(),
                LaunchCredentialRefused::class,
            );
        }

        Http::assertNothingSent();
    }

    public function test_a_journal_off_this_machine_needs_https(): void
    {
        $this->assertThrows(
            fn () => new EnvironmentCredentialSource(
                ['JOURNAL_URL' => 'http://journal.example', 'JOURNAL_LAUNCH_TOKEN' => 'launch-token'],
            )->forThisLaunch(),
            LaunchCredentialRefused::class,
        );

        $this->assertSame(
            'https://journal.example',
            new EnvironmentCredentialSource(
                ['JOURNAL_URL' => 'https://journal.example/', 'JOURNAL_LAUNCH_TOKEN' => 'launch-token', ...self::PIN],
            )->forThisLaunch()->journalUrl,
        );
        $this->assertSame(
            'http://localhost:8000',
            new EnvironmentCredentialSource(
                ['JOURNAL_URL' => 'http://localhost:8000', 'JOURNAL_LAUNCH_TOKEN' => 'launch-token', ...self::PIN],
            )->forThisLaunch()->journalUrl,
        );
    }

    public function test_a_missing_setting_is_named(): void
    {
        $this->assertThrows(
            fn () => new EnvironmentCredentialSource(['JOURNAL_URL' => 'https://journal.example'])->forThisLaunch(),
            LaunchSettingMissing::class,
            'JOURNAL_LAUNCH_TOKEN',
        );
    }

    private function settings(): AgentClientSettings
    {
        return new AgentClientSettings('http://journal.test', 'launch-token', new LaunchProfilePin('main-agent', 1));
    }
}
