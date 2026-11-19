<?php

declare(strict_types=1);

namespace App\Processes\Calls;

use App\Processes\Values\PartKey;
use Spatie\LaravelData\Data;

/**
 * One part of a run as it travels on the wire and in the spool: its syntax node, its attempt and its operation.
 */
final class RunPart extends Data
{
    public function __construct(
        public readonly int $node,
        public readonly int $attempt,
        public readonly string $operation,
    ) {}

    public static function of(PartKey $part): self
    {
        return new self($part->node, $part->attempt, $part->operation);
    }

    public function key(): PartKey
    {
        return new PartKey($this->node, $this->attempt, $this->operation);
    }
}
