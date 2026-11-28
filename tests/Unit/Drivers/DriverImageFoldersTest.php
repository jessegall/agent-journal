<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\ClaudeCode\ClaudeCodeHooks;
use App\Agents\Drivers\Codex\CodexHomeFiles;
use App\Agents\Drivers\Hooks\HookReplies;
use App\Hosts\Protocol\ContainedPlanFields;
use App\Support\HelperMounts;
use ReflectionClassConstant;
use Tests\TestCase;

/**
 * What a driver's image folder fixes for every contained start matches what the journal answers: Claude Code's
 * managed policy runs its hooks, and Codex's hooks keep their events and timeouts and its journal server the start
 * grant's variables.
 */
final class DriverImageFoldersTest extends TestCase
{
    private const string IMAGE_HOOK_COMMAND = '/opt/journal/bin/journal-hook';

    public function test_claude_codes_managed_policy_runs_every_hook_a_contained_start_answers(): void
    {
        $hooks = json_decode(str_replace(
            '{folder:files}',
            HelperMounts::SESSION_TARGET,
            (string) json_encode(ClaudeCodeHooks::running(self::IMAGE_HOOK_COMMAND), JSON_UNESCAPED_SLASHES),
        ), true);

        $this->assertSame($hooks, $this->jsonFile('.docker/drivers/claude-code/managed-settings.json')['hooks']);
    }

    public function test_codexs_hooks_hold_every_event_with_its_timeout_through_the_relays_hook_tool(): void
    {
        $events = new ReflectionClassConstant(CodexHomeFiles::class, 'HOOK_EVENTS')->getValue();
        $hooks = $this->jsonFile('.docker/drivers/codex/hooks.json')['hooks'];

        $inputs = array_map(fn (array $event) => $event[0]['hooks'][0]['input'], $hooks);
        $handlers = array_map(fn (array $event) => [['hooks' => [array_diff_key($event[0]['hooks'][0], ['input' => 0])]]], $hooks);

        $this->assertSame(
            array_map(fn (array $event) => [['hooks' => [[
                'type' => 'mcp_tool',
                'server' => 'journal',
                'tool' => 'hook',
                'timeout' => $event[1],
            ]]]], $events),
            $handlers,
        );

        // Each event's input rebuilds the event from its own fields, as Codex fills ${field} from the event it runs.
        foreach ($inputs as $input) {
            $this->assertSame(array_map(fn (string $field) => '${'.$field.'}', array_keys($input)), array_values($input));
        }
    }

    public function test_codexs_journal_server_answers_its_hooks_with_journal_hooks_arguments(): void
    {
        $config = (string) file_get_contents(base_path('.docker/drivers/codex/config.toml'));
        $replies = HelperMounts::SESSION_TARGET.'/'.HookReplies::REPLY_FILE;

        $this->assertMatchesRegularExpression(
            self::settingLine('args', json_encode(['codex', $replies], JSON_UNESCAPED_SLASHES)),
            str_replace('", "', '","', $config),
        );
    }

    public function test_codexs_journal_server_takes_the_start_grants_variables(): void
    {
        $config = (string) file_get_contents(base_path('.docker/drivers/codex/config.toml'));

        $this->assertMatchesRegularExpression(
            self::settingLine('env_vars', json_encode(ContainedPlanFields::START_GRANT_ENVIRONMENT)),
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

    /**
     * A pattern of the TOML line that sets the key to exactly the value.
     */
    private static function settingLine(string $key, string $value): string
    {
        return '/^'.preg_quote($key, '/').'\h*=\h*'.preg_quote($value, '/').'$/m';
    }
}
