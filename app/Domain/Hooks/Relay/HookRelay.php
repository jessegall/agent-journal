<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Relay;

use App\Domain\Agents\BypassFact;
use App\Domain\Agents\SignedCall;
use App\Domain\Hooks\Programs\CallFailure;
use App\Domain\Hooks\Programs\HookProgram;
use App\Domain\Hooks\Programs\OutageReply;
use App\Domain\Hooks\Programs\ProgramReply;
use App\Domain\Hooks\States\ReadyStateType;
use Carbon\CarbonImmutable;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Factory;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Str;

/**
 * What the host runs for every native hook call: upload the bypasses logged while the journal was away, sign the
 * call with the launch token, post it and give the program the journal's reply. When the journal cannot answer,
 * give the outage reply for the role and, for a main agent, log the bypass.
 */
final readonly class HookRelay
{
    public function __construct(private Factory $http) {}

    public function relay(HookProgram $program, string $payload, RelaySettings $settings): ProgramReply
    {
        $log = new BypassLog($settings->bypassLogPath);

        try {
            $this->uploadBypasses($settings, $log);
            $response = $this->post($settings, "/hooks/{$program->value}", $payload);
        } catch (ConnectionException) {
            return $this->answerAlone(CallFailure::Unreachable, $payload, $settings, $log);
        }

        if (! $response->successful()) {
            return $this->answerAlone(CallFailure::fromStatus($response->status()), $payload, $settings, $log);
        }

        return new ProgramReply((string) $response->json('stdout'), (string) $response->json('stderr'), (int) $response->json('exitCode'));
    }

    private function answerAlone(CallFailure $failure, string $payload, RelaySettings $settings, BypassLog $log): ProgramReply
    {
        $event = NativeEventName::of($payload);

        if ($failure->isOutage() && $settings->role === ReadyStateType::MainAgent) {
            $log->append(BypassFact::from(['nativeEvent' => $event, 'failure' => $failure->value, 'occurredAt' => CarbonImmutable::now()]));
        }

        return OutageReply::for($failure, $settings->role, $event);
    }

    private function uploadBypasses(RelaySettings $settings, BypassLog $log): void
    {
        $report = $log->pending();

        if ($report->isEmpty()) {
            return;
        }

        if ($this->post($settings, '/hooks/bypasses', $report->toJson())->successful()) {
            $log->clear();
        }
    }

    private function post(RelaySettings $settings, string $path, string $body): Response
    {
        $callId = (string) Str::ulid();
        $issuedAt = CarbonImmutable::now()->getTimestamp();

        return $this->http->timeout($settings->timeoutSeconds)
            ->withToken($settings->token)
            ->withHeaders([
                SignedCall::ID_HEADER => $callId,
                SignedCall::ISSUED_AT_HEADER => (string) $issuedAt,
                SignedCall::SIGNATURE_HEADER => SignedCall::signatureFor($settings->token, $callId, $issuedAt, SignedCall::digestOf($body)),
            ])
            ->withBody($body, 'application/json')
            ->accept('application/json')
            ->post($settings->journalUrl.$path);
    }
}
