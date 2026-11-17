<?php

declare(strict_types=1);

namespace App\Core\Hooks\Storage;

use App\Core\Hooks\Decisions\AnswerKind;
use Spatie\LaravelData\Data;

/**
 * The final answer of one hook call as it is kept for a retry: its kind and the exact reply the program received.
 */
final class RecordedAnswer extends Data
{
    public const CURRENT_VERSION = 1;

    public function __construct(
        public readonly int $version,
        public readonly AnswerKind $kind,
        public readonly string $stdout,
        public readonly string $stderr,
        public readonly int $exitCode,
    ) {}

    public static function of(AnswerKind $kind, string $stdout, string $stderr = '', int $exitCode = 0): self
    {
        return new self(self::CURRENT_VERSION, $kind, $stdout, $stderr, $exitCode);
    }

    public function checkVersion(): self
    {
        if ($this->version !== self::CURRENT_VERSION) {
            throw StoredValueInvalid::forVersion('answer', $this->version);
        }

        return $this;
    }
}
