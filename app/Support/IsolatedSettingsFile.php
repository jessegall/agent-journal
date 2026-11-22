<?php

declare(strict_types=1);

namespace App\Support;

use JsonSerializable;

/**
 * The shape of the isolated settings file: each hook event runs one journal command, and allowed and denied tools are
 * listed.
 */
final readonly class IsolatedSettingsFile implements JsonSerializable
{
    /**
     * @param  array<string, list<array{hooks: list<array{type: string, command: string}>}>>  $hooks
     * @param  list<string>  $allowedTools
     * @param  list<string>  $deniedTools
     */
    private function __construct(
        private array $hooks,
        private array $allowedTools,
        private array $deniedTools,
    ) {}

    /**
     * @param  array<string, string>  $hookCommands
     * @param  list<string>  $allowedTools
     * @param  list<string>  $deniedTools
     */
    public static function of(array $hookCommands, array $allowedTools, array $deniedTools): self
    {
        return new self(
            array_map(
                fn (string $command) => [['hooks' => [['type' => 'command', 'command' => $command]]]],
                $hookCommands,
            ),
            $allowedTools,
            $deniedTools,
        );
    }

    /**
     * @return array{
     *   hooks: array<string, list<array{hooks: list<array{type: string, command: string}>}>>,
     *   permissions: array{allow: list<string>, deny: list<string>},
     * }
     */
    public function jsonSerialize(): array
    {
        return [
            'hooks' => $this->hooks,
            'permissions' => ['allow' => $this->allowedTools, 'deny' => $this->deniedTools],
        ];
    }
}
