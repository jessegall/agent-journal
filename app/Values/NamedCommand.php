<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Agents\AccessType;
use App\Enums\Profiles\CommandDirectory;
use App\Enums\Profiles\ScriptOperandType;
use App\Exceptions\ProfileDraftRefused;

final class NamedCommand extends ScriptOperand
{
    /**
     * @param  list<string>  $arguments
     * @param  list<AccessType>  $effects  never empty: the parser refuses a command without effects
     */
    public function __construct(
        public readonly string $key,
        public readonly string $executable,
        public readonly array $arguments,
        public readonly CommandDirectory $directory,
        public readonly array $effects,
        public readonly int $timeoutSeconds,
    ) {
        $this->type = ScriptOperandType::Command;
    }

    public static function fromDefinition(string $key, mixed $definition): self
    {
        if (preg_match('/^[a-z][a-z0-9.-]{0,63}$/D', $key) !== 1 || ! is_array($definition)
            || count($definition) !== 5) {
            throw ProfileDraftRefused::invalidCommand($key);
        }

        $executable = $definition['executable'] ?? null;
        $arguments = $definition['arguments'] ?? null;
        $directory = $definition['directory'] ?? null;
        $effects = $definition['effects'] ?? null;
        $timeout = $definition['timeout_seconds'] ?? null;

        if (! is_string($executable) || ! str_starts_with($executable, '/') || str_contains($executable, "\0")
            || ! is_array($arguments) || ! array_is_list($arguments) || count($arguments) > 128
            || array_any($arguments, fn (mixed $argument) => ! self::isArgument($argument))
            || $directory !== CommandDirectory::Workspace->value
            || ! is_array($effects) || ! array_is_list($effects) || $effects === []
            || ! is_int($timeout) || $timeout < 1 || $timeout > 3600) {
            throw ProfileDraftRefused::invalidCommand($key);
        }

        return new self(
            $key,
            $executable,
            $arguments,
            CommandDirectory::Workspace,
            array_map(fn (mixed $effect) => self::effectOf($key, $effect), $effects),
            $timeout,
        );
    }

    private static function isArgument(mixed $argument): bool
    {
        return is_string($argument) && strlen($argument) <= 4096 && ! str_contains($argument, "\0");
    }

    private static function effectOf(string $key, mixed $effect): AccessType
    {
        if (! is_string($effect)) {
            throw ProfileDraftRefused::invalidCommand($key);
        }

        return AccessType::tryFrom($effect) ?? throw ProfileDraftRefused::invalidCommand($key);
    }

    /**
     * How the command reads in a flowchart: by its key.
     */
    public function label(): string
    {
        return $this->key;
    }
}
