<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\StateReturnScan;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A state's lifecycle, hook and fact methods and a listener's handle method give nothing, a command or an event
 * returned straight, or several yielded, never an array: read from the syntax tree of each one, its declared type,
 * every return and every yield. The engine checks the values themselves as it reads them.
 */
#[TimeLimit(seconds: 15, reason: 'It parses every PHP file of app and the domains.')]
final class StateReturnsTest extends TestCase
{
    private const string FIXTURE = 'tests/Fixtures/StateReturns/ArrayAnswerState.php';

    public function test_no_state_method_or_listener_gives_an_array(): void
    {
        $this->assertSame([], $this->faultsIn([base_path('app'), ...glob(base_path('domain/*/src'), GLOB_ONLYDIR) ?: []]));
    }

    public function test_an_array_type_and_an_array_or_plain_value_given_are_named_and_a_closure_is_not(): void
    {
        $this->assertSame([
            self::FIXTURE.':19 onEnter declares an array',
            self::FIXTURE.':21 onEnter gives an array',
            self::FIXTURE.':24 onSessionStart declares an iterable, not a Generator',
            self::FIXTURE.':26 onSessionStart gives an array',
            self::FIXTURE.':28 onSessionStart gives a plain value',
            self::FIXTURE.':36 onCompaction always yields its one answer: return it',
            self::FIXTURE.':43 onSessionEnd yields from elsewhere: yield each answer here',
        ], $this->faultsIn([base_path('tests/Fixtures/StateReturns')]));
    }

    /**
     * @param  list<string>  $folders
     * @return list<string>
     */
    private function faultsIn(array $folders): array
    {
        $faults = [];

        foreach (ScanCache::findingsInFolders(new StateReturnScan(), $folders) as $path => $found) {
            foreach ($found as $fault) {
                [$line, $what] = explode(' ', $fault, 2);
                $faults[] = substr($path, strlen(base_path()) + 1).":{$line} {$what}";
            }
        }

        sort($faults);

        return $faults;
    }
}
