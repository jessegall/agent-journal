<?php

declare(strict_types=1);

namespace App\Core\Hooks\Relay;

use App\Core\Agents\Support\AgentRequestClient;
use App\Core\Agents\Support\LoggedBypass;
use App\Core\Hooks\Enums\CallFailure;
use App\Core\Hooks\Enums\HookProgram;
use App\Core\Hooks\Enums\ReadyStateType;
use App\Core\Hooks\Programs\OutageReply;
use App\Core\Hooks\Programs\ProgramReply;
use Carbon\CarbonImmutable;
use Illuminate\Http\Client\ConnectionException;

/**
 * What the host runs for every native hook call: upload the bypasses logged while the journal was away, sign the
 * call with the launch token, post it and give the program the journal's reply. When the journal cannot answer,
 * give the outage reply for the role and, for a main agent, log the bypass.
 */
final readonly class HookRelay
{
    public function __construct(private AgentRequestClient $client) {}

    public function relay(HookProgram $program, string $payload, RelaySettings $settings): ProgramReply
    {
        $log = new BypassLog($settings->bypassLogPath);

        try {
            $this->uploadBypasses($settings, $log);
            $response = $this->client->post($settings->client(), "/hooks/{$program->value}", $payload);
        } catch (ConnectionException) {
            return $this->answerWithoutJournal(CallFailure::Unreachable, $payload, $settings, $log);
        }

        if (! $response->successful()) {
            return $this->answerWithoutJournal(CallFailure::fromStatus($response->status()), $payload, $settings, $log);
        }

        return new ProgramReply((string) $response->json('stdout'), (string) $response->json('stderr'), (int) $response->json('exitCode'));
    }

    private function answerWithoutJournal(CallFailure $failure, string $payload, RelaySettings $settings, BypassLog $log): ProgramReply
    {
        $event = ProgramEventName::of($payload);

        if ($failure->isOutage() && $settings->role === ReadyStateType::MainAgent) {
            $log->append(LoggedBypass::from(['nativeEvent' => $event, 'failure' => $failure->value, 'occurredAt' => CarbonImmutable::now()]));
        }

        return OutageReply::for($failure, $settings->role, $event);
    }

    private function uploadBypasses(RelaySettings $settings, BypassLog $log): void
    {
        $report = $log->pending();

        if ($report->isEmpty()) {
            return;
        }

        if ($this->client->post($settings->client(), '/hooks/bypasses', $report->toJson())->successful()) {
            $log->clear();
        }
    }
}
