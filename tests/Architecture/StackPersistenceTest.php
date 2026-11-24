<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\StackWriteScan;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A live stack is persisted only through the shared transition path, so every change settles its frames' lifecycle
 *. Whether a change rolls back or keeps its order is proved by the lifecycle tests, not here.
 */
#[TimeLimit(seconds: 15, reason: 'It parses every PHP file of app and the domains.')]
final class StackPersistenceTest extends TestCase
{
    /**
     * The shared path: the push, the engine's own stack changes, the hook pipeline's save, opening and closing a
     * stack, history pruning and the stack row itself.
     */
    private const array SHARED_PATH = [
        'app/Support/Mutations/StatePush.php',
        'app/Support/EngineStacks.php',
        'app/Pipes/Answer/SaveCall.php',
        'app/Support/StartStacks.php',
        'app/Support/PruneHookHistory.php',
        'app/Models/Agents/AgentStackRow.php',
    ];

    private const string FIXTURES = 'tests/Fixtures/Hooks/StackPersistence';

    public function test_only_the_shared_path_persists_a_live_stack(): void
    {
        $this->assertSame([], $this->writesIn(['app', 'domain']));
    }

    public function test_a_new_action_saving_frames_and_a_raw_frames_write_are_named(): void
    {
        $this->assertSame([
            self::FIXTURES.'/SavesFramesDirectly.php:21 calls saveFrames',
            self::FIXTURES.'/WritesFramesRaw.php:19 writes frames',
        ], $this->writesIn([self::FIXTURES]));
    }

    /**
     * @param  list<string>  $folders
     * @return list<string>
     */
    private function writesIn(array $folders): array
    {
        $found = [];

        foreach (ScanCache::findingsInFolders(new StackWriteScan(), array_map(base_path(...), $folders)) as $path => $writes) {
            $file = substr($path, strlen(base_path()) + 1);

            if (str_contains($file, '/tests/')) {
                continue;
            }

            if (in_array($file, self::SHARED_PATH, true)) {
                continue;
            }

            foreach ($writes as $write) {
                [$line, $what] = explode(' ', $write, 2);
                $found[] = "{$file}:{$line} {$what}";
            }
        }

        sort($found);

        return $found;
    }
}
