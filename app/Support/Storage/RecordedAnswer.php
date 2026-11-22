<?php

declare(strict_types=1);

namespace App\Support\Storage;

use App\Enums\AnswerType;
use App\Exceptions\StoredValueInvalid;
use Spatie\LaravelData\Data;

/**
 * The final answer of one hook call as it is kept for a retry: its type and the exact reply the driver received.
 */
final class RecordedAnswer extends Data
{
    public const int CURRENT_VERSION = 1;

    public function __construct(
        public readonly int $version,
        public readonly AnswerType $type,
        public readonly string $stdout,
        public readonly string $stderr,
        public readonly int $exitCode,
    ) {}

    public static function of(AnswerType $type, string $stdout, string $stderr = '', int $exitCode = 0): self
    {
        return new self(self::CURRENT_VERSION, $type, $stdout, $stderr, $exitCode);
    }

    public function assertCurrentVersion(): self
    {
        if ($this->version !== self::CURRENT_VERSION) {
            throw StoredValueInvalid::forVersion('answer', $this->version);
        }

        return $this;
    }
}
