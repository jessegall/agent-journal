<?php

declare(strict_types=1);

namespace App\Core\Hooks\Inputs;

final readonly class ToolResult
{
    public function __construct(
        public string $toolName,
        public ToolOutcome $outcome,
    ) {}
}
