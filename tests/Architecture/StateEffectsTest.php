<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\StateEffectScan;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A state's methods change nothing themselves: they answer with commands the engine runs. It reads
 * the calls written in the states and their traits; a collaborator that changes something, or dynamic PHP, stays a
 * matter for review.
 */
#[TimeLimit(seconds: 15, reason: 'It parses the state folders it judges.')]
final class StateEffectsTest extends TestCase
{
    /**
     * Where the states live: Core's areas and every domain.
     */
    private const array STATE_FOLDERS = ['app', 'domain'];

    private const string FIXTURES = 'tests/Fixtures/Hooks/StateEffects';

    public function test_no_production_state_changes_anything_itself(): void
    {
        $this->assertSame([], $this->effectsIn(array_map(base_path(...), self::STATE_FOLDERS)));
    }

    public function test_a_state_running_the_bus_or_writing_a_row_is_named_and_one_returning_a_command_passes(): void
    {
        $this->assertSame([
            self::FIXTURES.'/RunsTheBus.php:25 RunsTheBus::onStop calls run',
            self::FIXTURES.'/WritesARow.php:21 WritesARow::onStop calls save',
        ], $this->effectsIn([base_path(self::FIXTURES)]));
    }

    /**
     * @param  list<string>  $folders
     * @return list<string>
     */
    private function effectsIn(array $folders): array
    {
        $found = [];

        foreach (ScanCache::findingsInFolders(new StateEffectScan(), $folders) as $path => $effects) {
            $file = substr($path, strlen(base_path()) + 1);

            if (str_contains($file, '/tests/')) {
                continue;
            }

            foreach ($effects as $effect) {
                [$line, $call] = explode(' ', $effect, 2);
                $found[] = "{$file}:{$line} {$call}";
            }
        }

        sort($found);

        return $found;
    }
}
