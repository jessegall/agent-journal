<?php

declare(strict_types=1);

namespace App\Values;

use App\CommandRules\Enums\EvidenceSource;

/**
 * What one output read showed of one part: its envelope, or the bytes from the first byte up to the end byte of one
 * stream.
 */
final readonly class EvidenceRange
{
    private function __construct(
        public string $partRunId,
        public EvidenceSource $source,
        public int $firstByte,
        public int $endByte,
    ) {}

    public static function envelope(string $partRunId): self
    {
        return new self($partRunId, EvidenceSource::Envelope, 0, 0);
    }

    public static function bytes(string $partRunId, EvidenceSource $source, int $firstByte, int $endByte): self
    {
        return new self($partRunId, $source, $firstByte, $endByte);
    }
}
