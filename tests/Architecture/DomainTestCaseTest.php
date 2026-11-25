<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Support\ReflectedType;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase as BaseTestCase;

/**
 * Each domain with feature tests has its own TestCase, Domain\<Name>\Tests\TestCase extending the shared
 * Tests\TestCase,
 * and every feature test of the domain extends it; a unit test may stay on PHPUnit's own TestCase.
 */
#[TimeLimit(seconds: 15, reason: 'It parses the project files it judges.')]
final class DomainTestCaseTest extends TestCase
{
    public function test_every_domain_feature_test_extends_its_domains_test_case(): void
    {
        $wrong = [];

        foreach (glob(base_path('domain/*/tests/Feature'), GLOB_ONLYDIR) ?: [] as $folder) {
            $domain = basename(dirname($folder, 2));
            $base = "Domain\\{$domain}\\Tests\\TestCase";

            if (! ReflectedType::factory()->isSubclassOf($base, BaseTestCase::class)) {
                $wrong[] = "{$domain} has feature tests but no {$base} extending Tests\\TestCase";

                continue;
            }

            foreach ($this->featureTestClassesIn($folder, "Domain\\{$domain}\\Tests\\Feature") as $class) {
                if (! ReflectedType::factory()->isSubclassOf($class, $base)) {
                    $wrong[] = "{$class} does not extend {$base}";
                }
            }
        }

        $this->assertSame([], $wrong);
    }

    /**
     * @return list<string>
     */
    private function featureTestClassesIn(string $folder, string $namespace): array
    {
        $classes = [];

        foreach (new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($folder, \FilesystemIterator::SKIP_DOTS),
        ) as $file) {
            if ($file instanceof \SplFileInfo && str_ends_with($file->getFilename(), 'Test.php')) {
                $classes[] = $namespace.'\\'.str_replace(
                    '/',
                    '\\',
                    substr($file->getPathname(), strlen($folder) + 1, -4),
                );
            }
        }

        sort($classes);

        return $classes;
    }
}
