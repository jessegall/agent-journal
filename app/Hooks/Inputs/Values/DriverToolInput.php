<?php

declare(strict_types=1);

namespace App\Hooks\Inputs\Values;

use App\Hooks\Exceptions\UnreadablePayload;

/**
 * The tool arguments a driver sent, kept whole so a rewrite changes only the command.
 */
final readonly class DriverToolInput
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
        $argument = $this->arguments[$name] ?? null;

        return is_string($argument) ? $argument : null;
    }

    /**
     * Every named argument that holds text, in the order named; a call that leaves them all out gives none.
     *
     * @return list<string>
     */
    public function presentTexts(string ...$names): array
    {
        return array_values(array_filter(array_map($this->textArgument(...), $names), is_string(...)));
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
