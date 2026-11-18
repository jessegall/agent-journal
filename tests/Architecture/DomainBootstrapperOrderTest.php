<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Domains\Contracts\Domain;
use App\Domains\Contracts\ProvidesBootstrappers;
use ReflectionClass;
use ReflectionMethod;
use Tests\TestCase;

/**
 * A domain says what it is and what its boot runs before anything else: bootstrappers() is the method right below
 * description() (rule 35).
 */
final class DomainBootstrapperOrderTest extends TestCase
{
    public function test_bootstrappers_sit_right_below_description(): void
    {
        $misplaced = [];

        foreach ($this->domainClasses() as $class) {
            $methods = array_values(array_map(
                fn (ReflectionMethod $method) => $method->getName(),
                array_filter((new ReflectionClass($class))->getMethods(), fn (ReflectionMethod $method) => $method->getDeclaringClass()->getName() === $class),
            ));
            $afterDescription = $methods[array_search('description', $methods, true) + 1] ?? null;

            if ($afterDescription !== 'bootstrappers') {
                $misplaced[] = $class;
            }
        }

        $this->assertSame([], $misplaced, 'Declare bootstrappers() right below description() (rule 35).');
    }

    /**
     * @return list<class-string>
     */
    private function domainClasses(): array
    {
        $files = [...(glob(base_path('domain/*/src/*Domain.php')) ?: []), ...(glob(base_path('tests/Fixtures/Modules/*/src/*Domain.php')) ?: [])];
        $classes = [];

        foreach ($files as $file) {
            if (preg_match('/^namespace ([^;]+);/m', (string) file_get_contents($file), $namespace) !== 1) {
                continue;
            }

            $class = $namespace[1].'\\'.basename($file, '.php');

            if (is_subclass_of($class, Domain::class) && is_subclass_of($class, ProvidesBootstrappers::class)) {
                $classes[] = $class;
            }
        }

        return $classes;
    }
}
