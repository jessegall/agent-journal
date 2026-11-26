<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Support\CommandRegistry;
use App\Support\DeclaredType;
use App\Support\ReflectedMethod;
use App\Support\Reflector;
use Closure;
use Illuminate\Container\Container;
use Tests\Support\CodeReferenceScan;
use Tests\Support\ScanCache\ScanCache;

/**
 * The code each registered command runs: its handler, the module middleware it passes, and every project class they
 * take in their constructors, followed through concrete classes and container bindings. A closure binding is not
 * followed, so a check that must see every producer reads every file.
 */
final readonly class CommandReach
{
    /**
     * The name a file reached from a unit root carries in place of a handler's.
     */
    public const string UNIT_ROOT = 'a unit root';

    /**
     * @param  array<string, list<string>>  $handlersByFile  the short names of the handlers that reach each file
     */
    private function __construct(public array $handlersByFile) {}

    /**
     * @param  list<string>  $unitRoots  classes whose work runs in an event unit a command did not open, followed too
     */
    public static function of(
        CommandRegistry $registry,
        string $projectRoot,
        Container $container,
        array $unitRoots = [],
    ): self {
        $handlersByFile = [];
        $created = self::createdByFile($projectRoot);

        foreach (self::reachedFrom($unitRoots, $container, $created) as $file) {
            $handlersByFile[substr($file, strlen($projectRoot) + 1)][] = self::UNIT_ROOT;
        }

        foreach ($registry->handlerMap() as $command => $handler) {
            $middleware = array_map(
                fn ($registered) => $registered->middlewareClass(),
                $registry->middlewareFor($command),
            );
            $name = ModelWriteScan::shortName($handler);

            foreach (self::reachedFrom([$handler, ...$middleware], $container, $created) as $file) {
                $handlersByFile[substr($file, strlen($projectRoot) + 1)][] = $name;
            }
        }

        return new self(array_map(fn (array $names) => array_values(array_unique($names)), $handlersByFile));
    }

    /**
     * The files of the classes and every project class their constructors take or their code creates with new,
     * transitively, an interface through the class the container binds to it.
     *
     * @param  list<string>  $classes
     * @param  array<string, list<string>>  $created  the classes each file creates with new, by full path
     * @return list<string>
     */
    private static function reachedFrom(array $classes, Container $container, array $created): array
    {
        $files = [];
        $seen = [];

        while ($classes !== []) {
            $class = array_pop($classes);

            if (isset($seen[$class]) || ! Reflector::exists($class) || ! self::isProjectClass($class)) {
                continue;
            }

            $declaration = Reflector::of($class);

            if (! $declaration->isClass()) {
                array_push($classes, ...self::boundClassOf($class, $container));

                continue;
            }

            $seen[$class] = true;
            $file = $declaration->fileName()->getOrElse('');
            $files[] = $file;
            array_push($classes, ...$created[$file] ?? []);
            $parameters = $declaration->constructor()
                ->map(fn (ReflectedMethod $constructor) => $constructor->parameters())
                ->getOrElse([]);

            foreach ($parameters as $parameter) {
                $type = $parameter->type()
                    ->filter(fn (DeclaredType $declared) => $declared->isNamed() && ! $declared->isBuiltin());

                if ($type->isDefined()) {
                    $classes[] = $type->get()->name();
                }
            }
        }

        return $files;
    }

    /**
     * The classes each PHP file of the project's code creates with new, by full path.
     *
     * @return array<string, list<string>>
     */
    private static function createdByFile(string $projectRoot): array
    {
        $created = [];
        $folders = ["{$projectRoot}/app", ...DomainFiles::domainCode()];

        foreach (ScanCache::findingsByFile(new CodeReferenceScan(), DomainFiles::in($folders)) as $path => $findings) {
            foreach ($findings as $finding) {
                if (str_starts_with($finding, CodeReferenceScan::CREATES)) {
                    $created[$path][] = substr($finding, strlen(CodeReferenceScan::CREATES));
                }
            }
        }

        return $created;
    }

    /**
     * The class the container binds to an interface by name; none for an unbound interface or a closure binding.
     *
     * @return list<string>
     */
    private static function boundClassOf(string $interface, Container $container): array
    {
        $binding = $container->getBindings()[$interface]['concrete'] ?? null;

        if (! $binding instanceof Closure) {
            return [];
        }

        $concrete = Reflector::capturedBy($binding, 'concrete')->getOrElse(null);

        return is_string($concrete) && $concrete !== $interface ? [$concrete] : [];
    }

    private static function isProjectClass(string $class): bool
    {
        return str_starts_with($class, 'App\\') || str_starts_with($class, 'Domain\\');
    }
}
