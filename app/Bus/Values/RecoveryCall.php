<?php

declare(strict_types=1);

namespace App\Bus\Values;

final readonly class RecoveryCall
{
    /**
     * @param  array<string, string>  $arguments
     */
    public function __construct(public string $tool, public array $arguments = []) {}

    /**
     * @return array{tool: string, arguments: object}
     */
    public function toArray(): array
    {
        return ['tool' => $this->tool, 'arguments' => (object) $this->arguments];
    }
}
