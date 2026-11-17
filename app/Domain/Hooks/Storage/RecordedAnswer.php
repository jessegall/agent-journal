<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Storage;

use App\Domain\Hooks\Decisions\AnswerKind;
use Spatie\LaravelData\Data;

/**
 * The final answer of one hook call as it is kept for a retry: its kind and the exact response sent to the program.
 */
final class RecordedAnswer extends Data
{
    public const CURRENT_VERSION = 1;

    public function __construct(
        public readonly int $version,
        public readonly AnswerKind $kind,
        public readonly string $response,
    ) {}

    public static function of(AnswerKind $kind, string $response): self
    {
        return new self(self::CURRENT_VERSION, $kind, $response);
    }

    public function checkVersion(): self
    {
        if ($this->version !== self::CURRENT_VERSION) {
            throw StoredValueInvalid::forVersion('answer', $this->version);
        }

        return $this;
    }
}
