<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\ClaimedOutcome;
use App\Processes\Enums\OutputStream;
use App\Records\Enums\RecordRole;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One record a reader recognised, with its stream, its byte range, its role and the values it captured.
 */
#[MapName(SnakeCaseMapper::class)]
final class OutputRecord extends Data
{
    /**
     * @param  array<string, string>  $captures
     */
    public function __construct(
        public readonly OutputStream $stream,
        public readonly int $start,
        public readonly int $end,
        public readonly RecordRole $role,
        public readonly array $captures,
    ) {}

    /**
     * The whole number a capture holds, or null when the record captured none there.
     */
    public function count(string $field): int|null
    {
        $capturedOutput = $this->captures[$field] ?? '';

        if (ctype_digit($capturedOutput)) {
            return (int) $capturedOutput;
        }

        return null;
    }

    /**
     * The outcome an outcome line claims by the group it fills: passed, failed, or neither.
     */
    public function claimedOutcome(): ClaimedOutcome
    {
        return match (true) {
            $this->hasFilled(ClaimedOutcome::Passed->value) => ClaimedOutcome::Passed,
            $this->hasFilled(ClaimedOutcome::Failed->value) => ClaimedOutcome::Failed,
            default => ClaimedOutcome::Unknown,
        };
    }

    /**
     * Whether the record captured some text in the field.
     */
    private function hasFilled(string $field): bool
    {
        return array_key_exists($field, $this->captures) && $this->captures[$field] !== '';
    }
}
