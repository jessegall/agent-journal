<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Finder\Finder;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Only the driver registration decides anything by how a driver runs, headless or in a terminal: other code may carry
 * the driver type through, record it or declare a default, but never compares or matches on it.
 */
#[TimeLimit(seconds: 5, reason: 'It reads every PHP file of Core and the domains.')]
final class DriverTypeBoundaryTest extends TestCase
{
    /**
     * A comparison or a match on a driver type, or a case of one.
     */
    private const string DECIDES = '/->driver_?[tT]ype\s*[!=]==?|[!=]==?\s*\$?[\w>-]*->driver_?[tT]ype\b|'
        .'DriverType::\w+\s*[!=]==?|[!=]==?\s*DriverType::|match\s*\([^)]*driver_?[tT]ype\)|case\s+DriverType::/';

    /**
     * The driver registration: a registration, the registry that finds one by family and driver type, the host's
     * enrolled descriptor of a registration, found the same way, and the registered driver that refuses a request for a
     * driver type it was not registered for.
     */
    private const array REGISTRATION = [
        'app/Support/DriverCatalogue.php',
        'app/Support/Driver.php',
        'app/Values/DriverRegistration.php',
    ];

    private const string SAMPLE_DECISION = 'if ($runtime->driver_type === DriverType::Terminal) {';

    private const string SAMPLE_CARRIED = '$this->drivers->pinned($request->driver, $request->driverType);';

    public function test_no_code_but_the_driver_registration_decides_by_a_driver_type(): void
    {
        $found = [];
        $files = Finder::create()->files()->name('*.php')->in([base_path('app'), base_path('domain')])
            ->notPath('#/tests/#');

        foreach ($files as $file) {
            $path = substr($file->getPathname(), strlen(base_path()) + 1);

            if (! in_array($path, self::REGISTRATION, true) && preg_match(self::DECIDES, $file->getContents()) === 1) {
                $found[] = $path;
            }
        }

        $this->assertSame([], $found);
    }

    public function test_a_decision_is_caught_and_a_driver_type_carried_through_is_not(): void
    {
        $this->assertMatchesRegularExpression(self::DECIDES, self::SAMPLE_DECISION);
        $this->assertDoesNotMatchRegularExpression(self::DECIDES, self::SAMPLE_CARRIED);
    }
}
