<?php

declare(strict_types=1);

namespace App\AgentRequests\Support;

use App\AgentRequests\Contracts\CallSender;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Exceptions\AnswerUnreadable;
use App\AgentRequests\Exceptions\CallTooLarge;
use App\AgentRequests\Exceptions\JournalUnavailable;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use JsonException;
use Spatie\LaravelData\Data;
use Throwable;

/**
 * Sends a declared call: the path from its path values, each one encoded segment; the body from its other properties;
 * signed and sent through the request client, again under CallRetries when the failure may pass. The answer is read
 * strictly into the declared Data, and a coded refusal is thrown as its own class.
 */
final readonly class SendSignedCalls implements CallSender
{
    private const array PROXY_STATUSES = [502, 503, 504];

    public function __construct(private AgentRequestClient $client, private AgentClientSettings $settings) {}

    /**
     * @template TAnswer of Data
     *
     * @param  JournalCall<TAnswer>  $call
     * @return TAnswer
     */
    public function send(JournalCall $call): Data
    {
        $declaration = CallDeclaration::of($call::class);
        $values = $call instanceof Data ? $call->toArray() : [];
        $path = $this->pathOf($declaration, $values);
        $body = array_diff_key($values, array_flip($declaration->pathProperties));
        $prepared = $this->client->prepareWithId(
            $this->settings,
            "/agent/{$path}",
            (string) json_encode((object) $body, JSON_THROW_ON_ERROR),
            Str::ulid()->toString(),
            CarbonImmutable::now()->getTimestamp(),
        );
        $deadline = CarbonImmutable::now()->addSeconds($this->settings->timeoutSeconds);
        $key = isset($body['request_key']) ? new CallKey((string) $body['request_key']) : null;

        /**
         * @var TAnswer
         */
        return CallRetries::within(
            $declaration->endpoint->effect,
            $deadline,
            $prepared->callId,
            fn (CarbonImmutable $attemptDeadline) => $this->answerOf(
                $declaration,
                $this->client->sendPrepared($prepared, [], $attemptDeadline),
                $prepared->callId,
                $key,
            ),
        );
    }

    /**
     * @param  array<string, mixed>  $values
     */
    private function pathOf(CallDeclaration $declaration, array $values): string
    {
        return (string) preg_replace_callback(
            '/\{(\w+)\}/',
            fn (array $placeholder) => rawurlencode((string) $values[$placeholder[1]]),
            $declaration->endpoint->path,
        );
    }

    private function answerOf(CallDeclaration $declaration, AgentCallReply $reply, string $callId, CallKey|null $key): Data
    {
        $endpoint = $declaration->endpoint;

        if (strlen($reply->body) > $endpoint->answerLimit || $reply->status === 413) {
            throw CallTooLarge::answered(CallTooLarge::CODE, 'The answer is larger than the call allows.', $callId, $key, []);
        }

        try {
            $answer = json_decode($reply->body, true, 64, JSON_THROW_ON_ERROR);
        } catch (JsonException $unreadable) {
            if (in_array($reply->status, self::PROXY_STATUSES, true)) {
                throw JournalUnavailable::answered(JournalUnavailable::CODE, 'The journal cannot answer now.', $callId, $key, []);
            }

            throw AnswerUnreadable::at($declaration->call, 'body', $unreadable);
        }

        if (! is_array($answer)) {
            throw AnswerUnreadable::at($declaration->call, 'body');
        }

        if (! $reply->isSuccessful()) {
            if (! is_string($answer['code'] ?? null) || ! is_string($answer['message'] ?? null)) {
                throw AnswerUnreadable::at($declaration->call, 'refusal');
            }

            $class = RefusalExceptions::classOf($answer['code'], $endpoint->refusals);
            $details = is_array($answer['details'] ?? null) ? $answer['details'] : [];

            throw $class::answered($answer['code'], $answer['message'], $callId, $key, $details);
        }

        try {
            return $endpoint->answer::validateAndCreate($answer);
        } catch (Throwable $unreadable) {
            throw AnswerUnreadable::at($declaration->call, 'answer', $unreadable);
        }
    }
}
