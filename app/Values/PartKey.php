<?php

declare(strict_types=1);

namespace App\Values;

/**
 * Names one attempt of one part of a run wherever it is reported: the syntax node, the attempt number and the
 * operation it runs. The host and the server agree on it without sharing a database row.
 */
final readonly class PartKey
{
    public function __construct(public int $node, public int $attempt, public string $operation) {}

    public function partId(): string
    {
        return "node-{$this->node}";
    }

    public function name(): string
    {
        return "{$this->partId()}#{$this->attempt}";
    }
}
