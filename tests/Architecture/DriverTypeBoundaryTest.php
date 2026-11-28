<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Finder\Finder;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Nothing outside the drivers decides by which driver an agent runs. Other code may carry a driver's type,
 * key or family through, record it or look a registration up by it, but never compares or matches on one, nor on the
 * turn or terminal a driver runs; it asks the driver, through its interface.
 */
#[TimeLimit(seconds: 10, reason: 'It reads every PHP, TypeScript and Vue file of Core and the domains.')]
final class DriverTypeBoundaryTest extends TestCase
{
    /**
     * A comparison or a match on a driver type, or a case of one.
     */
    private const string DECIDES_BY_TYPE = '/->driver_?[tT]ype\s*[!=]==?|[!=]==?\s*\$?[\w>-]*->driver_?[tT]ype\b|'
        .'DriverType::\w+\s*[!=]==?|[!=]==?\s*DriverType::|match\s*\([^)]*driver_?[tT]ype\)|case\s+DriverType::/';

    /**
     * A comparison with, or a case of, one driver's key or family, written out or as DefaultDrivers names it.
     */
    private const string DECIDES_BY_DRIVER = '/[!=]==?\s*[\'"](claude-code|codex)(-headless)?[\'"]|'
        .'[\'"](claude-code|codex)(-headless)?[\'"]\s*[!=]==?|case\s+[\'"](claude-code|codex)(-headless)?[\'"]|'
        .'DefaultDrivers::(CLAUDE_CODE|CODEX)\s*[!=]==?|[!=]==?\s*DefaultDrivers::(CLAUDE_CODE|CODEX)/';

    /**
     * One of the processes a driver runs the agent in, its turn or its terminal, named.
     */
    private const string NAMES_A_DRIVER_PROCESS = '/HostProcessPurpose::Agent(Turn|Terminal)\b/';

    /**
     * The driver registration: a registration, the registry that finds one by family and driver type, and the
     * registered driver that refuses a request for a driver type it was not registered for.
     */
    private const array REGISTRATION = [
        'app/Agents/DriverCatalogue.php',
        'app/Agents/Driver.php',
        'app/Values/DriverRegistration.php',
    ];

    /**
     * The drivers themselves, and what may name a driver's processes beside them: the purposes' own enum, and the
     * terminal screens, which tell the agent's terminal from a sign-in's terminal that streams its screen too.
     */
    private const array DRIVER_PROCESSES = [
        'app/Hosts/Enums/HostProcessPurpose.php',
        'app/Terminals/HostFrameScreens.php',
    ];

    private const string DRIVERS = 'app/Agents/Drivers/';

    private const string SAMPLE_TYPE_DECISION = 'if ($runtime->driver_type === DriverType::Terminal) {';

    private const string SAMPLE_TYPE_CARRIED = '$this->drivers->pinned($request->driver, $request->driverType);';

    private const string SAMPLE_DRIVER_DECISION = "if (\$runtime->driver_key === 'claude-code-headless') {";

    private const string SAMPLE_DRIVER_CARRIED = '$this->drivers->forKey(DriverKey::from($runtime->driver_key));';

    private const string SAMPLE_PROCESS_DECISION = 'if ($process->purpose === HostProcessPurpose::AgentTurn) {';

    private const string SAMPLE_PROCESS_CARRIED = '->ofPurposes(HostProcessPurpose::agentPurposes())';

    public function test_no_code_but_the_driver_registration_decides_by_a_driver_type(): void
    {
        $this->assertSame([], $this->filesMatching(self::DECIDES_BY_TYPE, ['*.php'], self::REGISTRATION));
    }

    public function test_no_code_outside_the_drivers_decides_by_which_driver_it_has(): void
    {
        $this->assertSame(
            [],
            $this->filesMatching(self::DECIDES_BY_DRIVER, ['*.php', '*.ts', '*.vue'], self::REGISTRATION),
        );
    }

    public function test_no_code_outside_the_drivers_names_the_turn_or_terminal_a_driver_runs(): void
    {
        $this->assertSame([], $this->filesMatching(self::NAMES_A_DRIVER_PROCESS, ['*.php'], self::DRIVER_PROCESSES));
    }

    public function test_each_decision_is_caught_and_what_is_carried_through_is_not(): void
    {
        $this->assertSame(
            [true, false, true, false, true, false],
            [
                preg_match(self::DECIDES_BY_TYPE, self::SAMPLE_TYPE_DECISION) === 1,
                preg_match(self::DECIDES_BY_TYPE, self::SAMPLE_TYPE_CARRIED) === 1,
                preg_match(self::DECIDES_BY_DRIVER, self::SAMPLE_DRIVER_DECISION) === 1,
                preg_match(self::DECIDES_BY_DRIVER, self::SAMPLE_DRIVER_CARRIED) === 1,
                preg_match(self::NAMES_A_DRIVER_PROCESS, self::SAMPLE_PROCESS_DECISION) === 1,
                preg_match(self::NAMES_A_DRIVER_PROCESS, self::SAMPLE_PROCESS_CARRIED) === 1,
            ],
        );
    }

    /**
     * The source files of Core and the domains, outside the drivers, their tests and the generated types, that match.
     *
     * @param  list<string>  $names
     * @param  list<string>  $allowed
     * @return list<string>
     */
    private function filesMatching(string $pattern, array $names, array $allowed): array
    {
        $found = [];
        $files = Finder::create()->files()->name($names)
            ->in([base_path('app'), base_path('domain'), base_path('resources/js')])
            ->notPath(['#/tests/#', '#generated/#'])
            ->notName(['*.test.ts']);

        foreach ($files as $file) {
            $path = substr($file->getPathname(), strlen(base_path()) + 1);
            $isAllowed = in_array($path, $allowed, true) || str_starts_with($path, self::DRIVERS);

            if (! $isAllowed && preg_match($pattern, $file->getContents()) === 1) {
                $found[] = $path;
            }
        }

        return $found;
    }
}
