<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Finder\Finder;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Code outside a driver never chooses what to do by the driver's name: it never compares a driver key or family with
 * a literal, never looks for headless in a key and never tests for a concrete driver class. It asks the driver, its
 * registration or its capabilities instead.
 */
#[TimeLimit(seconds: 5, reason: 'It reads every PHP file of Core and the domains.')]
final class DriverNameDispatchTest extends TestCase
{
    private const string NAMES = '(claude-code|codex)(-headless)?';

    /**
     * A comparison or match arm on a driver name, either way round, a look for headless in a key, or an instanceof of
     * a concrete driver.
     */
    private const string DISPATCH = '~(===|!==|==|!=)\s*\'(?:'.self::NAMES.')\''
        .'|\'(?:'.self::NAMES.')\'\s*(===|!==|==|!=|=>)'
        .'|(===|!==)\s*DefaultDrivers::(CLAUDE_CODE|CODEX)\b|DefaultDrivers::(CLAUDE_CODE|CODEX)\s*(===|!==|=>)'
        .'|str_(contains|ends_with)\([^)]*\'headless\'\)'
        .'|instanceof\s+\w*(Claude|Codex)\w*Driver\b~';

    /**
     * Where a default driver's name is declared: its registration and the pinned build of its family.
     */
    private const array ALLOWED = [
        'app/Agents/Drivers/DefaultDrivers.php',
        'app/Support/Compatibility/DriverCompatibility.php',
        // The command lines host protocol 1 declares for each driver program, generated from protocol/host.json.
        'app/Hosts/Protocol/HostProgramLines.php',
    ];

    public function test_no_code_outside_the_registrations_dispatches_on_a_driver_name(): void
    {
        $found = [];
        $files = Finder::create()->files()->name('*.php')->in([base_path('app'), base_path('domain')])
            ->notPath('#/tests/#');

        foreach ($files as $file) {
            $path = substr($file->getPathname(), strlen(base_path()) + 1);

            if (! in_array($path, self::ALLOWED, true)) {
                $found = [...$found, ...self::dispatchesIn($path, $file->getContents())];
            }
        }

        $this->assertSame([], $found);
    }

    public function test_the_check_catches_code_that_dispatches_on_claude_code(): void
    {
        $fixture = "<?php\nif (\$runtime->family === 'claude-code') {\n}\n"
            ."\$headless = str_contains(\$key, 'headless');\n"
            ."\$label = match (\$key) {\n    'codex' => 'Codex',\n};\n";

        $this->assertSame([
            'fixture.php:2',
            'fixture.php:4',
            'fixture.php:6',
        ], self::dispatchesIn('fixture.php', $fixture));
    }

    /**
     * Every line of the source that dispatches on a driver's name, as path and line number.
     *
     * @return list<string>
     */
    private static function dispatchesIn(string $path, string $source): array
    {
        $found = [];

        foreach (explode("\n", $source) as $index => $line) {
            if (preg_match(self::DISPATCH, $line) === 1) {
                $found[] = $path.':'.($index + 1);
            }
        }

        return $found;
    }
}
