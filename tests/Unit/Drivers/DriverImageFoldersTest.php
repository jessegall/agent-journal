<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\ClaudeCode\ClaudeCodeHooks;
use App\Agents\Drivers\Codex\CodexHomeFiles;
use App\Hosts\Protocol\ContainedPlanFields;
use App\Support\MountRules;
use ReflectionClassConstant;
use Tests\TestCase;

/**
 * What a driver's image folder fixes for every contained start is what the journal hands a contained start today:
 * Claude Code's managed policy with its hooks, and Codex's hooks with their events and timeouts and its journal server
 * with the start grant's variables.
 */
final class DriverImageFoldersTest extends TestCase
{
    private const string IMAGE_HOOK_COMMAND = '/opt/journal/bin/journal-hook';

    public function test_claude_codes_managed_policy_is_the_template_with_the_hooks_a_contained_start_runs(): void
    {
        $template = $this->jsonFile('resources/agents/claude-code-managed-settings.json');
        $hooks = json_decode(str_replace(
            '{folder:files}',
            MountRules::SESSION_TARGET,
            (string) json_encode(ClaudeCodeHooks::running(self::IMAGE_HOOK_COMMAND), JSON_UNESCAPED_SLASHES),
        ), true);

        $this->assertSame(
            [...$template, 'hooks' => $hooks],
            $this->jsonFile('.docker/drivers/claude-code/managed-settings.json'),
        );
    }

    public function test_codexs_hooks_hold_every_event_with_its_timeout_through_the_relays_hook_tool(): void
    {
        $events = new ReflectionClassConstant(CodexHomeFiles::class, 'HOOK_EVENTS')->getValue();
        $hooks = $this->jsonFile('.docker/drivers/codex/hooks.json')['hooks'];

        $this->assertSame(
            array_map(fn (array $event) => [['hooks' => [[
                'type' => 'mcp_tool',
                'server' => 'journal',
                'tool' => 'hook',
                'timeout' => $event[1],
            ]]]], $events),
            $hooks,
        );
    }

    public function test_codexs_journal_server_takes_the_start_grants_variables(): void
    {
        $config = (string) file_get_contents(base_path('.docker/drivers/codex/config.toml'));

        $this->assertStringContainsString(
            'env_vars = '.json_encode(ContainedPlanFields::START_GRANT_ENVIRONMENT),
            str_replace('", "', '","', $config),
        );
    }

    /**
     * @return array<string, mixed>
     */
    private function jsonFile(string $path): array
    {
        return json_decode((string) file_get_contents(base_path($path)), true, flags: JSON_THROW_ON_ERROR);
    }
}
