<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\StaticFactoryScan;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A function holds what a static factory gave it instead of asking for it again with the same arguments, and a class
 * the container builds takes the ReflectorFactory in its constructor instead of calling the Reflector statically
 *.
 */
#[TimeLimit(seconds: 30, reason: 'It parses every source file of app and the domains.')]
final class RepeatedStaticFactoryTest extends TestCase
{
    private const string REPEATED_ADVICE = 'Hold the first answer in a variable and ask it again:';

    private const string INJECTABLE_ADVICE = 'Take App\Contracts\Reflection\ReflectorFactory '
        .'in the constructor and call make():';

    public function test_no_function_calls_one_static_factory_twice_with_the_same_arguments(): void
    {
        $this->assertSame(
            [],
            $this->findings(StaticFactoryScan::REPEATED),
            self::REPEATED_ADVICE,
        );
    }

    public function test_no_class_the_container_builds_calls_the_reflector_statically(): void
    {
        $this->assertSame(
            [],
            $this->findings(StaticFactoryScan::INJECTABLE),
            self::INJECTABLE_ADVICE,
        );
    }

    /**
     * @return list<string>
     */
    private function findings(string $reason): array
    {
        $folders = [app_path(), ...glob(base_path('domain/*/src'), GLOB_ONLYDIR) ?: []];
        $lines = [];

        foreach (ScanCache::findingsInFolders(new StaticFactoryScan(), $folders) as $path => $findings) {
            foreach ($findings as $finding) {
                if ($finding['reason'] === $reason) {
                    $lines[] = substr($path, strlen(base_path()) + 1).":{$finding['line']} {$finding['call']}";
                }
            }
        }

        return $lines;
    }
}
