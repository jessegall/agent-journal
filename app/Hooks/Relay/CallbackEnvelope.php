<?php

declare(strict_types=1);

namespace App\Hooks\Relay;

use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use JsonException;
use Spatie\LaravelData\Data;

/**
 * One native hook callback as the host sends it: its own id, the exact body and its digest, the first issue time and
 * the deadline from it. A retry sends the same envelope; a new callback gets a new one, even with the same text.
 */
final class CallbackEnvelope extends Data
{
    /**
     * How long after its first issue time a callback may still be answered; a retry never moves it.
     */
    public const int DEADLINE_SECONDS = 19;

    public function __construct(
        public readonly string $id,
        public readonly string $program,
        public readonly string $body,
        public readonly string $bodyDigest,
        public readonly int $issuedAt,
        public readonly int $deadlineAt,
    ) {}

    public static function forCallback(string $program, string $body, CarbonImmutable $now): self
    {
        return new self(
            (string) Str::ulid(),
            $program,
            $body,
            hash('sha256', $body),
            $now->getTimestamp(),
            $now->getTimestamp() + self::DEADLINE_SECONDS,
        );
    }

    /**
     * @throws JsonException
     */
    public static function fromJson(string $json): self
    {
        return CallbackEnvelope::from(json_decode($json, true, 4, JSON_THROW_ON_ERROR));
    }

    public function deadline(): CarbonImmutable
    {
        return CarbonImmutable::createFromTimestamp($this->deadlineAt);
    }

    /**
     * The envelope as the host keeps it while it waits for an answer, its slashes unescaped.
     */
    public function toJson($options = 0): string
    {
        return json_encode($this->toArray(), JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | $options);
    }
}
