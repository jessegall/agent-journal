<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Domains\ApiPayload;
use App\Contracts\Domains\ApiSender as ApiSenderContract;
use App\Data\Agents\RefusalAnswerData;
use App\Exceptions\AnswerUnreadable;
use App\Exceptions\ApiTooLarge;
use App\Exceptions\JournalUnavailable;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use JsonException;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use Throwable;
use TypeError;

/**
 * Sends a declared call: the path from its path values, each one encoded segment; the body from its other properties;
 * signed and sent through the request client, again under ApiRetries when the failure may pass. The answer is read
 * strictly into the declared Data, and a coded refusal is thrown as its own class.
 */
final readonly class ApiSender implements ApiSenderContract
{
    private const array PROXY_STATUSES = [
        502,
        503,
        504,
    ];

    public function __construct(private AgentRequestClient $client, private AgentClientSettings $settings) {}

    /**
     * @template TAnswer of Data
     *
     * @param  ApiPayload<TAnswer>  $call
     * @return TAnswer
     */
    public function send(ApiPayload $call): Data
    {
        $declaration = ApiDeclaration::of($call::class);
        $callFields = $call instanceof Data ? $call->toArray() : [];
        $path = $this->pathOf($declaration, $callFields);
        $body = array_diff_key($callFields, array_flip($declaration->pathProperties));

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
        return ApiRetries::within(
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
     * @param  array<string, mixed>  $fields
     */
    private function pathOf(ApiDeclaration $declaration, array $fields): string
    {
        return (string) preg_replace_callback(
            '/\{(\w+)\}/',
            fn (array $placeholder) => rawurlencode((string) $fields[$placeholder[1]]),
            $declaration->endpoint->path,
        );
    }

    private function answerOf(
        ApiDeclaration $declaration,
        AgentCallReply $reply,
        string $callId,
        CallKey|null $key,
    ): Data {
        $endpoint = $declaration->endpoint;

        if (strlen($reply->body) > $endpoint->answerLimit || $reply->status === 413) {
            $message = 'The answer is larger than the call allows.';

            throw ApiTooLarge::answered(ApiTooLarge::CODE, $message, $callId, $key, []);
        }

        if (! $reply->isSuccessful()) {
            $refusal = $this->refusalOf($declaration, $reply, $callId, $key);
            $class = RefusalExceptions::classOf($refusal->code, $endpoint->refusals);

            throw $class::answered($refusal->code, $refusal->message, $callId, $key, $refusal->details);
        }

        try {
            return $endpoint->answer::from($reply->body);
        } catch (Throwable $unreadable) {
            throw AnswerUnreadable::at($declaration->call, 'answer', $unreadable);
        }
    }

    /**
     * The refusal a failed call answered with, its code, message and details.
     */
    private function refusalOf(
        ApiDeclaration $declaration,
        AgentCallReply $reply,
        string $callId,
        CallKey|null $key,
    ): RefusalAnswerData {
        try {
            return RefusalAnswerData::from(json_decode($reply->body, true, 64, JSON_THROW_ON_ERROR));
        } catch (JsonException $unreadable) {
            if (in_array($reply->status, self::PROXY_STATUSES, true)) {
                throw JournalUnavailable::answered(
                    JournalUnavailable::CODE,
                    'The journal cannot answer now.',
                    $callId,
                    $key,
                    [],
                    $unreadable,
                );
            }

            throw AnswerUnreadable::at($declaration->call, 'body', $unreadable);
        } catch (CannotCreateData|TypeError $unreadable) {
            throw AnswerUnreadable::at($declaration->call, 'refusal', $unreadable);
        }
    }
}
