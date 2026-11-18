<?php

declare(strict_types=1);

namespace App\Hooks\Relay;

use App\AgentRequests\Exceptions\CallDeadlinePassed;
use App\AgentRequests\Exceptions\JournalUnreachable;
use App\AgentRequests\Support\AgentCallReply;
use App\AgentRequests\Support\AgentRequestClient;
use App\Agents\Support\LoggedBypass;
use App\Hooks\Enums\CallFailure;
use App\Hooks\Enums\ReadyStateType;
use App\Hooks\Programs\OutageReply;
use App\Hooks\Programs\ProgramReply;
use App\Programs\Enums\HookProgram;
use Carbon\CarbonImmutable;
use Illuminate\Http\Client\ConnectionException;

/**
 * What the host runs for every native hook call: upload the bypasses logged while the journal was away, give the
 * callback its own envelope, keep it, post it, send the same envelope again once if the journal could not be reached,
 * and give the program the journal's reply. When the journal cannot answer before the deadline, give the outage reply
 * for the role and, for a main agent, log the bypass.
 */
final readonly class HookRelay
{
    /**
     * How many times one envelope is sent before the outage reply.
     */
    private const int ATTEMPTS = 2;

    public function __construct(private AgentRequestClient $client) {}

    public function relay(HookProgram $program, string $payload, RelaySettings $settings): ProgramReply
    {
        $log = new BypassLog($settings->bypassLogPath);
        $pending = new PendingEnvelopes($settings->pendingEnvelopesFolder());
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
        $answer = json_decode($reply->body, true, 4, JSON_THROW_ON_ERROR);

        return new ProgramReply((string) $answer['stdout'], (string) $answer['stderr'], (int) $answer['exitCode']);
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
            $call = $this->client->prepareWithId($settings->client(), $settings->hookPath($envelope->program), $envelope->body, $envelope->id, $envelope->issuedAt);

            try {
                return $this->client->sendPrepared($call, [], $envelope->deadline());
            } catch (JournalUnreachable $unreachable) {
                if ($attempt >= self::ATTEMPTS) {
                    throw $unreachable;
                }
            }
        }
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
