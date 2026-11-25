<?php

declare(strict_types=1);

namespace App\Support\Drivers;

use App\Enums\TransportProfileType;
use App\Exceptions\JournalServerUnresolved;

/**
 * The journal's MCP server as a Codex account runs it from its common config.toml: the protected PHP binary running
 * the protected installation's bin/journal-mcp, both by absolute path, told only the names of the variables it reads
 * from the launch. No token, work folder or launch path is ever written into the shared file.
 */
final readonly class CodexJournalServer
{
    public const string HEADER = '[mcp_servers.journal]';

    public const array PASSED_VARIABLES = [
        'JOURNAL_URL',
        'JOURNAL_LAUNCH_REF',
    ];

    public const int STARTUP_TIMEOUT_SECONDS = 15;

    public const int TOOL_TIMEOUT_SECONDS = 30;

    private function __construct(
        public string $command,
        public string $relay,
    ) {}

    /**
     * @throws JournalServerUnresolved
     */
    public static function of(string $command, string $relay): self
    {
        foreach ([
            $command,
            $relay,
        ] as $path) {
            if (! self::isFixedPath($path)) {
                throw JournalServerUnresolved::for($path);
            }
        }

        return new self($command, $relay);
    }

    /**
     * The whole [mcp_servers.journal] table: required, its tools approved, with the start and call timeouts.
     */
    public function tomlTable(TransportProfileType $transport = TransportProfileType::Mcp): string
    {
        $variables = implode(
            ', ',
            array_map(fn (string $name): string => sprintf('"%s"', $name), self::PASSED_VARIABLES),
        );

        $header = self::HEADER;
        $command = addcslashes($this->command, '"\\');
        $relay = addcslashes($this->relay, '"\\');
        $startup = self::STARTUP_TIMEOUT_SECONDS;
        $tool = self::TOOL_TIMEOUT_SECONDS;

        $table = <<<TOML
            {$header}
            command = "{$command}"
            args = ["{$relay}"]
            env_vars = [{$variables}]
            required = true
            default_tools_approval_mode = "approve"
            startup_timeout_sec = {$startup}
            tool_timeout_sec = {$tool}

            TOML;

        if ($transport === TransportProfileType::Cli) {
            return rtrim($table)."\nenabled = false\n";
        }

        return $table;
    }

    /**
     * Whether the path is absolute and clean, holds no variable or placeholder, and no part of it looks like a secret.
     */
    private static function isFixedPath(string $path): bool
    {
        $looksSecret = preg_match('/[A-Za-z0-9+_=-]{40,}|token|secret|bearer/i', $path) === 1;

        return str_starts_with($path, '/')
            && ! str_contains($path, '/../')
            && ! str_contains($path, '/./')
            && strpbrk($path, '$%{}<>"\'') === false
            && ! $looksSecret;
    }
}
