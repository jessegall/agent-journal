<?php

declare(strict_types=1);

namespace App\Hooks\Relay;

use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use JsonException;

/**
 * One native hook callback as the host sends it: its own id, the exact body and its digest, the first issue time and
 * the deadline from it. A retry sends the same envelope; a new callback gets a new one, even with the same text.
 */
final readonly class CallbackEnvelope
{
    /**
     * How long after its first issue time a callback may still be answered; a retry never moves it.
     */
    public const int DEADLINE_SECONDS = 19;

    public function __construct(
        public string $id,
        public string $program,
        public string $body,
        public string $bodyDigest,
        public int $issuedAt,
        public int $deadlineAt,
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
        $fields = json_decode($json, true, 4, JSON_THROW_ON_ERROR);

        return new self(
            $fields['id'],
            $fields['program'],
            $fields['body'],
            $fields['bodyDigest'],
            $fields['issuedAt'],
            $fields['deadlineAt'],
        );
    }

    public function deadline(): CarbonImmutable
    {
        return CarbonImmutable::createFromTimestamp($this->deadlineAt);
    }

    public function toJson(): string
    {
        return json_encode(get_object_vars($this), JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES);
    }
}
