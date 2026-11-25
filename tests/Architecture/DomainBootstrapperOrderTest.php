<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Support\Domain;
use App\Support\ReflectedMethod;
use App\Support\ReflectedType;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A domain that adds boot steps of its own says what it is and what its boot runs first: bootstrappers() is the method
 * right below description().
 */
#[TimeLimit(seconds: 15, reason: 'It parses the project files it judges.')]
final class DomainBootstrapperOrderTest extends TestCase
{
    private const string HOW_TO_FIX = 'Declare bootstrappers() right below description() (rule 35).';

    public function test_bootstrappers_sit_right_below_description(): void
    {
        $misplaced = [];

        foreach ($this->domainClasses() as $class) {
            $methods = array_values(array_map(
                fn (ReflectedMethod $method) => $method->name(),
                array_filter(
                    ReflectedType::of($class)->methods(),
                    fn (ReflectedMethod $method) => $method->declaringClass()->name() === $class,
                ),
            ));
            $afterDescription = $methods[array_search('description', $methods, true) + 1] ?? null;

            if ($afterDescription !== 'bootstrappers') {
                $misplaced[] = $class;
            }
        }

        $this->assertSame([], $misplaced, self::HOW_TO_FIX);
    }

    /**
     * @return list<class-string>
     */
    private function domainClasses(): array
    {
        $files = [
            ...(glob(base_path('domain/*/src/*Domain.php')) ?: []),
            ...(glob(base_path('tests/Fixtures/Modules/*/src/*Domain.php')) ?: []),
        ];
        $classes = [];

        foreach ($files as $file) {
            if (preg_match('/^namespace ([^;]+);/m', (string) file_get_contents($file), $namespace) !== 1) {
                continue;
            }

            $class = $namespace[1].'\\'.basename($file, '.php');

            if (! ReflectedType::factory()->isSubclassOf($class, Domain::class)) {
                continue;
            }

            $domain = ReflectedType::of($class);

            if ($domain->method('bootstrappers')->declaringClass() === $domain) {
                $classes[] = $class;
            }
        }

        return $classes;
    }
}
