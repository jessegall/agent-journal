<?php

declare(strict_types=1);

namespace App\Values;

/**
 * The read that opens a hit: the owner's tool and its arguments, such as tasks_read with task_id. The palette
 * follows the same record to its page.
 */
final readonly class OpenAction
{
    /**
     * @param  array<string, string|int>  $arguments
     */
    public function __construct(
        public string $tool,
        public array $arguments,
    ) {}

    /**
     * @return array{tool: string, arguments: array<string, string|int>}
     */
    public function toArray(): array
    {
        return ['tool' => $this->tool, 'arguments' => $this->arguments];
    }
}
