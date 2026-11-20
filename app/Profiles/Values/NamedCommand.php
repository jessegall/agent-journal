<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Operations\Enums\AccessType;
use App\Profiles\Enums\CommandDirectory;
use App\Profiles\Exceptions\ProfileDraftRefused;
use JsonSerializable;

final readonly class NamedCommand implements JsonSerializable
{
    /**
     * @param  list<string>  $arguments
     * @param  non-empty-list<AccessType>  $effects
     */
    private function __construct(
        public string $key,
        public string $executable,
        public array $arguments,
        public CommandDirectory $directory,
        public array $effects,
        public int $timeoutSeconds,
    ) {}

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

    /**
     * @return array{
     *     executable: string, arguments: list<string>, directory: string, effects: list<string>, timeout_seconds: int
     * }
     */
    public function jsonSerialize(): array
    {
        return [
            'executable' => $this->executable,
            'arguments' => $this->arguments,
            'directory' => $this->directory->value,
            'effects' => array_map(fn (AccessType $access) => $access->value, $this->effects),
            'timeout_seconds' => $this->timeoutSeconds,
        ];
    }
}
