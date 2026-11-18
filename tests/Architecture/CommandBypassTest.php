<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\CallScan;
use Tests\Architecture\Support\DomainFiles;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Commands run only through the CommandBus (doc 19, story 70) and entry adapters write only by dispatching a command
 * (story 86), in every owner already moved onto the bus. The list grows phase by phase as owners move.
 */
#[TimeLimit(seconds: 15, reason: 'It parses the project files it judges.')]
final class CommandBypassTest extends TestCase
{
    /**
     * The folders judged: Core's handlers and bus, every domain and the test modules.
     */
    public const array CHECKED = ['app/Agents/Handlers', 'app/Assignments/Handlers', 'app/Bus', 'app/Records/Handlers', 'domain/Access/src', 'domain/Chat/src', 'domain/Documents/src', 'domain/Memory/src', 'domain/Plans/src', 'domain/Processes/src', 'domain/Profiles/src', 'domain/Reminders/src', 'domain/Rules/src', 'domain/Sequences/src', 'domain/Tasks/src', 'tests/Fixtures/Modules'];

    /**
     * Calls that reach Laravel's shared bus around the CommandBus.
     */
    private const array BYPASSES = ['pipeThrough', 'map', 'dispatchSync', 'dispatchNow'];

    /**
     * The one place that may call Laravel's dispatcher directly.
     */
    private const string BUS = 'app/Bus/Support/LaravelCommandBus.php';

    public function test_nothing_reaches_laravels_dispatcher_around_the_command_bus(): void
    {
        $this->assertSame([], $this->bypassesIn(self::CHECKED));
    }

    public function test_a_direct_dispatch_in_a_checked_folder_is_named(): void
    {
        $this->assertSame(['tests/Fixtures/Bus/Bypass/DispatchesDirectly.php:14 calls Bus::dispatchSync'], $this->bypassesIn(['tests/Fixtures/Bus/Bypass']));
    }

    /**
     * @param  list<string>  $folders
     * @return list<string>
     */
    private function bypassesIn(array $folders): array
    {
        $found = [];

        foreach (ScanCache::findingsByFile(new CallScan, DomainFiles::in(array_map(base_path(...), $folders))) as $path => $calls) {
            $file = substr($path, strlen(base_path()) + 1);

            if ($file === self::BUS) {
                continue;
            }

            foreach ($calls as $call) {
                $viaFacade = $call['class'] !== null && str_ends_with($call['class'], 'Bus');

                // map is also a collection method, so only the Bus facade's map counts.
                if (in_array($call['method'], self::BYPASSES, true) && ($viaFacade || ($call['class'] === null && $call['method'] !== 'map'))) {
                    $found[] = "{$file}:{$call['line']} calls ".($call['class'] === null ? '' : class_basename($call['class']).'::').$call['method'];
                }
            }
        }

        return $found;
    }
}
