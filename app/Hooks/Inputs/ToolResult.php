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

    /**
     * The text argument of this name, or null when the call had none.
     */
    public function textArgument(string $name): string|null
    {
        return $this->arguments->textArgument($name);
    }

    public function hasArgument(string $name): bool
    {
        return $this->arguments->hasArgument($name);
    }
}
