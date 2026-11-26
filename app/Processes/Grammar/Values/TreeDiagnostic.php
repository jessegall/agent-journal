<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Values;

use App\Values\AgentText;

/**
 * Where and why a line did not read as a complete tree: a byte position and a reason in plain words.
 */
final readonly class TreeDiagnostic
{
    public function __construct(
        public int $position,
        public AgentText $reason,
    ) {}
}
