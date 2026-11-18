<?php

declare(strict_types=1);

namespace App\Hooks\Inputs;

use App\Hooks\Enums\ToolOutcome;

final readonly class ToolResult
{
    /**
     * @param  array<string, mixed>  $arguments  the arguments the program called the tool with
     */
    public function __construct(
        public string $toolName,
        public ToolOutcome $outcome,
        public array $arguments,
    ) {}

    /**
     * The text argument of this name, or null when the call had none.
     */
    public function textArgument(string $name): string|null
    {
        $value = $this->arguments[$name] ?? null;

        return is_string($value) ? $value : null;
    }

    public function hasArgument(string $name): bool
    {
        return array_key_exists($name, $this->arguments) && $this->arguments[$name] !== null;
    }
}
