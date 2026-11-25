<?php

declare(strict_types=1);

namespace App\Mcp\Data;

use Spatie\LaravelData\Data;

/**
 * The tool call an agent makes next, with the exact arguments to send.
 */
final class NextAction extends Data
{
    /**
     * @param  array<string, mixed>  $arguments
     */
    public function __construct(
        public readonly string $tool,
        public readonly array $arguments,
    ) {}

    /**
     * @return array{tool: string, arguments: array<string, mixed>}
     */
    public function structuredContent(): array
    {
        return [
            'tool' => $this->tool,
            'arguments' => $this->arguments,
        ];
    }
}
