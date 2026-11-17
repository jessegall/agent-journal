<?php

declare(strict_types=1);

namespace App\Core\Hooks\Inputs;

use App\Core\Hooks\Enums\ToolOutcome;

final readonly class ToolResult
{
    public function __construct(
        public string $toolName,
        public ToolOutcome $outcome,
    ) {}
}
