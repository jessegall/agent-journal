<?php

declare(strict_types=1);

namespace App\Hooks\Values;

/**
 * Which instruction a frame produces: its instruction type and the exact subject it names. It holds no text, counts,
 * claims or credentials, and it authorizes nothing.
 */
final readonly class InstructionMarker
{
    public function __construct(public string $instructionType, public string $subjectId, public int $runNumber) {}
}
