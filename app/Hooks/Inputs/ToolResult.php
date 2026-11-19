<?php

declare(strict_types=1);

namespace App\Hooks\Inputs;

use App\Hooks\Enums\ToolOutcome;

final readonly class ToolResult
{
    public function __construct(
        public string $toolName,
        public ToolOutcome $outcome,
        public ProgramToolInput $arguments,
    ) {}
}
