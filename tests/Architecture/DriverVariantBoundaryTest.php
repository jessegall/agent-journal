<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Finder\Finder;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Only the driver registration decides anything by how a driver runs, headless or in a terminal: other code may carry
 * the variant through, record it or declare a default, but never compares or matches on it.
 */
#[TimeLimit(seconds: 5, reason: 'It reads every PHP file of Core and the domains.')]
final class DriverVariantBoundaryTest extends TestCase
{
    /**
     * A comparison or a match on a variant, or a case of one.
     */
    private const string DECIDES = '/->variant\s*[!=]==?|[!=]==?\s*\$?[\w>-]*->variant\b|DriverVariant::\w+\s*[!=]==?|'
        .'[!=]==?\s*DriverVariant::|match\s*\([^)]*variant\)|case\s+DriverVariant::/';

    /**
     * The driver registration, which refuses a request for a variant it was not registered for.
     */
    private const string REGISTRATION = 'app/Support/RegisteredDriver.php';

    private const string SAMPLE_DECISION = 'if ($runtime->variant === DriverVariant::Terminal) {';

    private const string SAMPLE_CARRIED = '$this->drivers->pinned($request->driver, $request->variant);';

    public function test_no_code_but_the_driver_registration_decides_by_a_variant(): void
    {
        $found = [];
        $files = Finder::create()->files()->name('*.php')->in([base_path('app'), base_path('domain')])
            ->notPath('#/tests/#');

        foreach ($files as $file) {
            $path = substr($file->getPathname(), strlen(base_path()) + 1);

            if ($path !== self::REGISTRATION && preg_match(self::DECIDES, $file->getContents()) === 1) {
                $found[] = $path;
            }
        }

        $this->assertSame([], $found);
    }

    public function test_a_decision_is_caught_and_a_variant_carried_through_is_not(): void
    {
        $this->assertMatchesRegularExpression(self::DECIDES, self::SAMPLE_DECISION);
        $this->assertDoesNotMatchRegularExpression(self::DECIDES, self::SAMPLE_CARRIED);
    }
}
