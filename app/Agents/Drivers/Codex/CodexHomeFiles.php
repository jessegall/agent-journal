<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Agents\Drivers\Contracts\PlanPart;
use App\Agents\Drivers\Enums\CodexAgentFeature;
use App\Agents\Values\PlanFile;
use App\Agents\Values\RelayedHookCommand;
use App\Values\DriverStart;
use App\Values\PlanAddition;

/**
 * The isolated home of a Codex start with no account: its config.toml and, with a hook command, its hooks.json.
 */
final readonly class CodexHomeFiles implements PlanPart
{
    /**
     * Every native hook event of 0.165.0 with its key in a trust entry and its timeout in seconds.
     */
    private const array HOOK_EVENTS = [
        'SessionStart' => [
            'session_start',
            600,
        ],
        'UserPromptSubmit' => [
            'user_prompt_submit',
            600,
        ],
        'PreToolUse' => [
            'pre_tool_use',
            600,
        ],
        'PostToolUse' => [
            'post_tool_use',
            600,
        ],
        'Stop' => [
            'stop',
            600,
        ],
        'SessionEnd' => [
            'session_end',
            1,
        ],
    ];

    private const string HOOK_NAME = 'codex';

    /**
     * The isolated home of a start with no account: a config.toml with every agent feature off, and, with a hook
     * command, the hooks.json that relays every native event and the config tables that trust each hook.
     */
    public function __invoke(DriverStart $start): PlanAddition
    {
        $features = implode("\n", array_map(
            fn (CodexAgentFeature $feature) => "{$feature->value} = false",
            CodexAgentFeature::cases(),
        ));

        $config = "[features]\n{$features}\n";

        if ($start->hookCommand === null) {
            return new PlanAddition([new PlanFile('config.toml', $config)]);
        }

        $command = RelayedHookCommand::for($start->hookCommand, self::HOOK_NAME)->text;

        $hookFile = CodexHome::FILES_FOLDER.'/hooks.json';

        return new PlanAddition([
            new PlanFile('hooks.json', self::encode(['hooks' => $this->hooks($command)])),
            new PlanFile('config.toml', $config.self::trustTables($hookFile, $command)),
        ]);
    }

    /**
     * @return array<string, list<array<string, mixed>>>
     */
    private function hooks(string $command): array
    {
        $hook = [['hooks' => [['type' => 'command', 'command' => $command]]]];

        return array_fill_keys(array_keys(self::HOOK_EVENTS), $hook);
    }

    /**
     * The [hooks.state] tables that mark each hook trusted, hashed the way Codex hashes a command hook's identity, so
     * the hooks run without a trust prompt.
     */
    private static function trustTables(string $hookFile, string $command): string
    {
        $tables = '';

        foreach (self::HOOK_EVENTS as [$key, $timeout]) {
            // Codex hashes the identity with its keys in order, as Go's encoding of a map writes them.
            $identity = [
                'event_name' => $key,
                'hooks' => [[
                    'async' => false,
                    'command' => $command,
                    'timeout' => $timeout,
                    'type' => 'command',
                ]],
            ];

            $digest = hash('sha256', json_encode($identity, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));
            $name = json_encode("{$hookFile}:{$key}:0:0", JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES);

            $tables .= <<<TOML

                [hooks.state.{$name}]
                enabled = true
                trusted_hash = "sha256:{$digest}"

                TOML;
        }

        return $tables;
    }

    /**
     * @param  array<string, mixed>  $value
     */
    private static function encode(array $value): string
    {
        return json_encode($value, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }
}
