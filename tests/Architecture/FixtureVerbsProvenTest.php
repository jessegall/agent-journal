<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Support\ReflectedMethod;
use App\Support\ReflectedType;
use Tests\Architecture\Support\CallScan;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Every public verb of the test journal and of each domain's fixture objects is called by a test of the fixture
 * itself: the journal's in tests/Feature/Seeding, a domain fixture's in the tests beside it, so no test leans on a
 * verb nobody proved.
 */
#[TimeLimit(seconds: 15, reason: 'It parses the seeding and fixture tests.')]
final class FixtureVerbsProvenTest extends TestCase
{
    private const string HOW_TO_FIX = 'Prove each verb by a test of the fixture itself:';

    private const string REGISTRAR = 'Fixtures.php';

    public function test_every_fixture_verb_is_called_by_a_test_of_its_fixture(): void
    {
        $unproven = $this->unprovenOf(TestJournal::class, glob(base_path('tests/Feature/Seeding/*Test.php')) ?: []);

        foreach (glob(base_path('domain/*/tests/Fixtures/*Fixtures.php')) ?: [] as $file) {
            if (basename($file) === self::REGISTRAR) {
                continue;
            }

            $tests = glob(dirname($file).'/*Test.php') ?: [];
            $unproven = [...$unproven, ...$this->unprovenOf(self::classIn($file), $tests)];
        }

        $this->assertSame([], $unproven, self::HOW_TO_FIX);
    }

    /**
     * Each public method of the class, its traits' included, that none of the tests calls, as Class::method.
     *
     * @param  class-string  $class
     * @param  list<string>  $tests
     * @return list<string>
     */
    private function unprovenOf(string $class, array $tests): array
    {
        $called = [];

        foreach (ScanCache::findingsByFile(new CallScan(), $tests) as $calls) {
            $called = [...$called, ...array_column($calls, 'method')];
        }

        $unproven = array_filter(
            ReflectedType::of($class)->methods(),
            fn (ReflectedMethod $method) => $method->isPublic()
                && $method->name() !== '__construct'
                && ! in_array($method->name(), $called, true),
        );

        return array_values(array_map(
            fn (ReflectedMethod $method) => class_basename($class).'::'.$method->name(),
            $unproven,
        ));
    }

    /**
     * @return class-string
     */
    private static function classIn(string $file): string
    {
        preg_match('#domain/(\w+)/tests/Fixtures/(\w+)\.php$#', $file, $parts);

        /** @var class-string */
        return "Domain\\{$parts[1]}\\Tests\\Fixtures\\{$parts[2]}";
    }
}
