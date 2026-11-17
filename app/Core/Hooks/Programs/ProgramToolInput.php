<?php

declare(strict_types=1);

namespace App\Core\Hooks\Programs;

/**
 * The tool arguments a program sent, kept whole so a rewrite changes only the command.
 */
final readonly class ProgramToolInput
{
    /**
     * @param  array<string, mixed>  $arguments
     */
    public function __construct(private array $arguments) {}

    /**
     * @return array<string, mixed>
     */
    public function withCommand(string $command): array
    {
        return array_replace($this->arguments, ['command' => $command]);
    }
}
