<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Finder\Finder;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Nothing above the driver chooses how an operation is carried out by the runtime's driver type: only Agents records
 * it, and only the host's runtime factory picks a driver by it (doc 40 revision 3, sections 5 and 61).
 */
#[TimeLimit(seconds: 5, reason: 'It reads every PHP file of Core and the domains.')]
final class DriverVariantBoundaryTest extends TestCase
{
    /**
     * The words that read a runtime's variant.
     */
    private const string READS = '/->variant\b|DriverVariant::(Headless|Terminal)\b/';

    /**
     * The one place outside app/Agents that may name a variant: Core's public list of exported types.
     */
    private const array ALLOWED = ['app/CoreApi.php'];

    public function test_no_code_outside_agents_reads_a_runtimes_variant(): void
    {
        $found = [];
        $files = Finder::create()->files()->name('*.php')->in([base_path('app'), base_path('domain')])
            ->notPath('#/tests/#');

        foreach ($files as $file) {
            $path = substr($file->getPathname(), strlen(base_path()) + 1);

            if (self::mayNameVariant($path)) {
                continue;
            }

            if (preg_match(self::READS, $file->getContents()) === 1) {
                $found[] = $path;
            }
        }

        $this->assertSame([], $found);
    }

    /**
     * Agents keeps a runtime's variant and Profiles declares and chooses the default a launch runs with.
     */
    private static function mayNameVariant(string $path): bool
    {
        return str_starts_with($path, 'app/Agents/')
            || str_starts_with($path, 'app/Profiles/')
            || in_array($path, self::ALLOWED, true);
    }
}
