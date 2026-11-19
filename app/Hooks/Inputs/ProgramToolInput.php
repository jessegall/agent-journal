<?php

declare(strict_types=1);

namespace App\Hooks\Inputs;

use App\Hooks\Exceptions\UnreadablePayload;

/**
 * The tool arguments a program sent, kept whole so a rewrite changes only the command.
 */
final readonly class ProgramToolInput
{
    /**
     * @param  array<string, mixed>  $arguments
     */
    public function __construct(public array $arguments) {}

    /**
     * The first of the named arguments that holds text; a call with none of them is unreadable.
     */
    public function firstText(string ...$names): string
    {
        foreach ($names as $name) {
            if (is_string($this->arguments[$name] ?? null)) {
                return $this->arguments[$name];
            }
        }

        throw UnreadablePayload::missing(implode(' or ', $names));
    }

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

    /**
     * @return array<string, mixed>
     */
    public function withCommand(string $command): array
    {
        return array_replace($this->arguments, ['command' => $command]);
    }
}
