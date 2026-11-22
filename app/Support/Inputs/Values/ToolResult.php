<?php

declare(strict_types=1);

namespace App\Support\Inputs\Values;

use App\Enums\ToolOutcome;

final readonly class ToolResult
{
    public function __construct(
        public string $toolName,
        public ToolOutcome $outcome,
        public DriverToolInput $arguments,
    ) {}
}
