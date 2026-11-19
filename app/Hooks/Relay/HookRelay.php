<?php

declare(strict_types=1);

namespace App\Hooks\Relay;

use App\AgentRequests\Exceptions\CallDeadlinePassed;
use App\AgentRequests\Exceptions\JournalUnreachable;
use App\AgentRequests\Support\AgentCallReply;
use App\AgentRequests\Support\AgentRequestClient;
use App\Agents\Support\LoggedBypass;
use App\Hooks\Enums\CallFailure;
use App\Hooks\Exceptions\ProgramReplyMalformed;
use App\Hooks\Programs\OutageReply;
use App\Hooks\Programs\ProgramReply;
use App\Programs\Enums\HookProgram;
use Carbon\CarbonImmutable;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Http\Client\ConnectionException;
use JsonException;

/**
 * What the host runs for every native hook call: upload the bypasses logged while the journal was away, give the
 * callback its own envelope, keep it, post it, send the same envelope again once if the journal could not be reached,
 * and give the program the journal's reply. Only a transport failure is an outage: then the launch's sealed offline
 * reply answers, and a neutral one is logged as a bypass. Any status or malformed body from the journal is its answer
 * and is refused, never bypassed. While disconnected the relay cannot see a profile revoked meanwhile; every call
 * after reconnection is authenticated again with the pinned profile.
 */
final readonly class HookRelay
{
    /**
     * How many times one envelope is sent before the outage reply.
     */
    private const int ATTEMPTS = 2;

    public function __construct(
        private AgentRequestClient $client,
        private Filesystem $files,
    ) {}

    public function relay(HookProgram $program, string $payload, RelaySettings $settings): ProgramReply
    {
        $log = new BypassLog($settings->bypassLogPath);
        $pending = new PendingEnvelopes($this->files, $settings->pendingEnvelopesFolder());
        $envelope = CallbackEnvelope::forCallback($program->value, $payload, CarbonImmutable::now());
        $pending->keep($envelope);

        try {
            $this->uploadBypasses($settings, $log);
            $reply = $this->send($envelope, $settings);
        } catch (ConnectionException|JournalUnreachable|CallDeadlinePassed) {
            return $this->answerWithoutJournal(CallFailure::Unreachable, $payload, $settings, $log);
        }

        if (! $reply->isSuccessful()) {
            return $this->answerWithoutJournal(CallFailure::fromStatus($reply->status), $payload, $settings, $log);
        }

        $pending->acknowledge($envelope);

        try {
            return ProgramReply::fromJournal($reply->body);
        } catch (JsonException|ProgramReplyMalformed) {
            return $this->answerWithoutJournal(CallFailure::Refused, $payload, $settings, $log);
        }
    }

    /**
     * Sends the envelope under its own id and first issue time, and once more on a transport failure; the deadline
     * stays the first one.
     *
     * @throws JournalUnreachable
     * @throws CallDeadlinePassed
     */
    private function send(CallbackEnvelope $envelope, RelaySettings $settings): AgentCallReply
    {
        for ($attempt = 1; ; $attempt++) {
            $call = $this->client->prepareWithId(
                $settings->client(),
                $settings->hookPath($envelope->program),
                $envelope->body,
                $envelope->id,
                $envelope->issuedAt,
            );

            try {
                return $this->client->sendPrepared($call, [], $envelope->deadline());
            } catch (JournalUnreachable $unreachable) {
                if ($attempt >= self::ATTEMPTS) {
                    throw $unreachable;
                }
            }
        }
    }

    private function answerWithoutJournal(
        CallFailure $failure,
        string $payload,
        RelaySettings $settings,
        BypassLog $log,
    ): ProgramReply {
        $event = ProgramEventName::of($payload);

        if ($failure->isOutage() && $settings->passesOutages) {
            $log->append(LoggedBypass::from([
                'nativeEvent' => $event,
                'failure' => $failure->value,
                'occurredAt' => CarbonImmutable::now(),
            ]));
        }

        return OutageReply::for($failure, $settings->passesOutages, $event);
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
