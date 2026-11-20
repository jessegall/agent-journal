<?php

declare(strict_types=1);

namespace App\Hooks\Relay;

use App\AgentRequests\Contracts\AgentRequestClient;
use App\AgentRequests\Exceptions\CallDeadlinePassed;
use App\AgentRequests\Exceptions\JournalUnreachable;
use App\AgentRequests\Support\AgentCallReply;
use App\Agents\Support\LoggedBypass;
use App\Hooks\Enums\CallFailure;
use App\Hooks\Enums\HookEvent;
use App\Hooks\Exceptions\OutputGrantsInvalid;
use App\Hooks\Exceptions\ProgramReplyMalformed;
use App\Hooks\Inputs\ProtectedFileRead;
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
 * and give the program the journal's reply. Only a transport failure is an outage: then the start's sealed offline
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

    /**
     * The one native tool whose call an output grant may let through with the journal away: a file read.
     */
    private const string READ_TOOL = 'Read';

    public function __construct(
        private AgentRequestClient $client,
        private Filesystem $files,
        private OutputGrantSeal $grantSeal,
    ) {}

    public function relay(HookProgram $program, string $hookJson, RelaySettings $settings): ProgramReply
    {
        $log = new BypassLog($settings->bypassLogPath);
        $pending = new PendingEnvelopes($this->files, $settings->pendingEnvelopesFolder());
        $envelope = CallbackEnvelope::forCallback($program->value, $hookJson, CarbonImmutable::now());
        $preparation = new PreparationState($this->files, $settings->preparationFile());
        $event = HookEvent::tryFrom(ProgramEventName::of($hookJson));

        if ($event?->isToolCall() === true && ! $preparation->isPrepared()) {
            return OutageReply::preparationPending($event->value);
        }

        if ($event === HookEvent::SessionStart) {
            $preparation->openGeneration($envelope->id);
        }

        $pending->keep($envelope);

        try {
            $this->uploadBypasses($settings, $log);
            $reply = $this->send($envelope, $settings);
        } catch (ConnectionException|JournalUnreachable|CallDeadlinePassed) {
            return $this->answerWithoutJournal(CallFailure::Unreachable, $hookJson, $settings, $log);
        }

        if (! $reply->isSuccessful()) {
            return $this->answerWithoutJournal(CallFailure::fromStatus($reply->status), $hookJson, $settings, $log);
        }

        $pending->acknowledge($envelope);

        try {
            $programReply = ProgramReply::fromJournal($reply->body);
        } catch (JsonException|ProgramReplyMalformed) {
            return $this->answerWithoutJournal(CallFailure::Refused, $hookJson, $settings, $log);
        }

        if ($event === HookEvent::SessionStart) {
            $preparation->prepare($envelope->id);
        }

        return $programReply;
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
        string $hookJson,
        RelaySettings $settings,
        BypassLog $log,
    ): ProgramReply {
        $event = ProgramEventName::of($hookJson);

        if ($failure->isOutage() && $settings->passesOutages && $this->touchesAccounts($hookJson, $settings)) {
            return OutageReply::protectedRefusal($event);
        }

        if ($failure->isOutage() && $settings->passesOutages) {
            $log->append(LoggedBypass::from([
                'nativeEvent' => $event,
                'failure' => $failure->value,
                'occurredAt' => CarbonImmutable::now(),
            ]));
        }

        return OutageReply::for($failure, $settings->passesOutages, $event);
    }

    /**
     * Whether a tool call reaches a saved account's folder. With no journal, a file read of one of the start's own
     * outputs passes when the host's sealed snapshot grants that exact file; anything else in the account is
     * refused, and so is every read when the snapshot is missing, stale or not sealed for this start.
     */
    private function touchesAccounts(string $hookJson, RelaySettings $settings): bool
    {
        $call = json_decode($hookJson, true);

        if (! is_array($call) || ! is_array($call['tool_input'] ?? null)) {
            return false;
        }

        $workFolder = is_string($call['cwd'] ?? null) ? $call['cwd'] : '/';
        $readPath = $call['tool_input']['file_path'] ?? null;
        $isOwnOutputRead = ($call['tool_name'] ?? null) === self::READ_TOOL && is_string($readPath)
            && $this->grantsOf($settings)->allowsRead(ProtectedFileRead::resolve($workFolder, $readPath));

        if ($isOwnOutputRead) {
            return false;
        }

        return $settings->accounts->isTouchedByToolCall($call['tool_input'], $workFolder);
    }

    /**
     * The start's sealed output grants; a snapshot that is not sealed for this start grants nothing.
     */
    private function grantsOf(RelaySettings $settings): OutputGrants
    {
        if ($settings->startKey === '' || ! is_file($settings->outputGrantsFile)) {
            return OutputGrants::none();
        }

        try {
            return OutputGrants::fromSnapshot(
                (string) file_get_contents($settings->outputGrantsFile),
                $settings->startKey,
                $this->grantSeal,
            );
        } catch (OutputGrantsInvalid $invalid) {
            report($invalid);

            return OutputGrants::none();
        }
    }

    private function uploadBypasses(RelaySettings $settings, BypassLog $log): void
    {
        $report = $log->pending();

        if ($report->isEmpty()) {
            return;
        }

        if ($this->client
            ->post($settings->client(), route('hooks.bypasses', absolute: false), $report->toJson())
            ->successful()) {
            $log->clear();
        }
    }
}
