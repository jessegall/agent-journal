<?php

declare(strict_types=1);

namespace App\Hooks\Relay;

use App\AgentRequests\Contracts\AgentRequestClient;
use App\AgentRequests\Exceptions\CallDeadlinePassed;
use App\AgentRequests\Exceptions\JournalUnreachable;
use App\AgentRequests\Support\AgentCallReply;
use App\Agents\Values\LoggedBypass;
use App\Drivers\Enums\HookDriver;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Hooks\Drivers\DriverReply;
use App\Hooks\Drivers\OutageReply;
use App\Hooks\Enums\CallFailure;
use App\Hooks\Enums\HookEvent;
use App\Hooks\Exceptions\DriverReplyMalformed;
use App\Hooks\Exceptions\OutputGrantsInvalid;
use App\Hooks\Inputs\ProtectedFileRead;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Http\Client\ConnectionException;
use JsonException;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use TypeError;

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
        private Files $files,
        private OutputGrantSeal $grantSeal,
        private Repository $config,
    ) {}

    public function relay(HookDriver $driver, string $json, RelaySettings $settings): DriverReply
    {
        $this->config->set(Place::HookRuntime->rootSetting(), $settings->runtimeFolder());
        $log = new BypassLog($this->files, $settings->bypassLog());
        $pending = new PendingEnvelopes($this->files, $settings->pendingEnvelopesFolder());
        $envelope = CallbackEnvelope::forCallback($driver->value, $json, CarbonImmutable::now());
        $preparation = new PreparationState($this->files, $settings->preparationFile());
        $event = HookEvent::tryFrom(DriverEventName::of($json));

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
            return $this->answerWithoutJournal(CallFailure::Unreachable, $json, $settings, $log);
        }

        if (! $reply->isSuccessful()) {
            return $this->answerWithoutJournal(CallFailure::fromStatus($reply->status), $json, $settings, $log);
        }

        $pending->acknowledge($envelope);

        try {
            $driverReply = DriverReply::fromJournal($reply->body);
        } catch (JsonException|DriverReplyMalformed) {
            return $this->answerWithoutJournal(CallFailure::Refused, $json, $settings, $log);
        }

        if ($event === HookEvent::SessionStart) {
            $preparation->prepare($envelope->id);
        }

        return $driverReply;
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
                $settings->hookPath($envelope->driver),
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
        string $json,
        RelaySettings $settings,
        BypassLog $log,
    ): DriverReply {
        $event = DriverEventName::of($json);

        if ($failure->isOutage() && $settings->passesOutages && $this->touchesAccounts($json, $settings)) {
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
    private function touchesAccounts(string $json, RelaySettings $settings): bool
    {
        try {
            $call = RelayedToolCall::from(json_decode($json, true, 512, JSON_THROW_ON_ERROR));
        } catch (JsonException|CannotCreateData|TypeError) {
            return false;
        }

        $readPath = $call->readPath();
        $isOwnOutputRead = $call->toolName === self::READ_TOOL && $readPath !== null
            && $this->grantsOf($settings)->allowsRead(ProtectedFileRead::resolve($call->cwd, $readPath));

        if ($isOwnOutputRead) {
            return false;
        }

        return $settings->accounts->isTouchedByToolCall($call->toolInput, $call->cwd);
    }

    /**
     * The start's sealed output grants; a snapshot that is not sealed for this start grants nothing.
     */
    private function grantsOf(RelaySettings $settings): OutputGrants
    {
        $isGiven = $settings->startKey !== '' && $settings->outputGrantsFile !== '';

        if (! $isGiven || ! $this->files->exists($settings->outputGrants())) {
            return OutputGrants::none();
        }

        try {
            return OutputGrants::fromSnapshot(
                $this->files->read($settings->outputGrants()),
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
