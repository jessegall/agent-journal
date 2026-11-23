<?php

declare(strict_types=1);

namespace App\Values;

/**
 * The tool call that gets an agent out of a refusal: the journal tool to call next and the arguments to call it
 * with, sent along with the refusal as its next action, such as reading the message it must answer first.
 */
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
