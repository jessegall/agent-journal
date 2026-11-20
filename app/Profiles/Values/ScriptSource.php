<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Profiles\Exceptions\ProfileDraftRefused;

final readonly class ScriptSource
{
    public const int MAX_BYTES = 262144;

    /**
     * @param  list<NamedCommand>  $commands
     */
    public function __construct(public string $text, public array $commands = [])
    {
        if (strlen($text) > self::MAX_BYTES || count($commands) > 64) {
            throw ProfileDraftRefused::oversized();
        }
    }

    public static function empty(): self
    {
        return new self('');
    }

    /**
     * @param  array<string, mixed>  $commands
     */
    public static function fromDefinitions(string $text, array $commands): self
    {
        $definitions = [];

        foreach ($commands as $key => $definition) {
            $definitions[$key] = NamedCommand::fromDefinition((string) $key, $definition);
        }

        ksort($definitions);

        return new self($text, array_values($definitions));
    }

    /**
     * @return array<string, NamedCommand>
     */
    public function definitions(): array
    {
        return array_column($this->commands, null, 'key');
    }

    public function isEmpty(): bool
    {
        return $this->text === '' && $this->commands === [];
    }

    public function hash(): string
    {
        return hash('sha256', $this->text);
    }
}
