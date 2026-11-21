<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\ReservedCommandScan;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The reserved instruction commands are built only by states, which return them for the engine to run, and named
 * otherwise only by their own handler, the allowlist and Core's export list (doc 74, story 51). A forged or stale
 * origin that this cannot see is refused at run time by the allowlist.
 */
#[TimeLimit(seconds: 15, reason: 'It parses every PHP file of app and the domains.')]
final class ReservedInstructionCommandsTest extends TestCase
{
    /**
     * The files besides states that may name a reserved command: the commands, their handlers, the allowlist and the
     * export list.
     */
    private const array OWNERS = [
        'app/CoreApi.php',
        'app/Hooks/Support/ReservedInstructions.php',
        'app/Hooks/Commands/FocusInstruction.php',
        'app/Hooks/Commands/ReleaseInstruction.php',
        'app/Hooks/Commands/RefreshPlanInstruction.php',
        'app/Hooks/Handlers/FocusInstructionHandler.php',
        'app/Hooks/Handlers/ReleaseInstructionHandler.php',
        'app/Hooks/Handlers/RefreshPlanInstructionHandler.php',
    ];

    private const string FIXTURES = 'tests/Fixtures/Hooks/ReservedCommands';

    public function test_only_states_and_the_commands_own_files_name_a_reserved_command(): void
    {
        $this->assertSame([], $this->foreignNamesIn(['app', 'domain']));
    }

    public function test_a_handler_building_one_a_helper_building_one_and_a_caller_passing_one_on_are_named(): void
    {
        $this->assertSame([
            self::FIXTURES.'/BuildsThroughAHelper.php:28 names App\\Hooks\\Commands\\FocusInstruction',
            self::FIXTURES.'/FocusesFromAHandler.php:20 names App\\Hooks\\Commands\\FocusInstruction',
            self::FIXTURES.'/PassesOneOn.php:17 names App\\Hooks\\Commands\\ReleaseInstruction',
        ], $this->foreignNamesIn([self::FIXTURES]));
    }

    /**
     * @param  list<string>  $folders
     * @return list<string>
     */
    private function foreignNamesIn(array $folders): array
    {
        $found = [];

        foreach (ScanCache::findingsInFolders(new ReservedCommandScan(), array_map(base_path(...), $folders)) as $path => $names) {
            $file = substr($path, strlen(base_path()) + 1);

            if (str_contains($file, '/tests/')) {
                continue;
            }

            foreach ($names as $finding) {
                [$line, $owner, $command] = explode(' ', $finding, 3);

                if ($owner === 'state' || in_array($file, self::OWNERS, true)) {
                    continue;
                }

                $found[] = "{$file}:{$line} names {$command}";
            }
        }

        sort($found);

        return $found;
    }
}
