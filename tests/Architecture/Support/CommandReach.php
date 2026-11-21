<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Bus\Support\CommandRegistry;
use App\Reflection\Support\DeclaredType;
use App\Reflection\Support\ReflectedMethod;
use App\Reflection\Support\Reflector;

/**
 * The code each registered command runs: its handler, the module middleware it passes, and every project class they
 * take in their constructors, followed through each concrete class. An interface's implementations are not followed,
 * so a check that must see every producer still reads every file.
 */
final readonly class CommandReach
{
    /**
     * @param  array<string, list<string>>  $handlersByFile  the short names of the handlers that reach each file
     */
    private function __construct(public array $handlersByFile) {}

    public static function of(CommandRegistry $registry, string $projectRoot): self
    {
        $handlersByFile = [];

        foreach ($registry->handlerMap() as $command => $handler) {
            $middleware = array_map(
                fn ($registered) => $registered->middlewareClass(),
                $registry->middlewareFor($command),
            );
            $name = ModelWriteScan::shortName($handler);

            foreach (self::reachedFrom([$handler, ...$middleware]) as $file) {
                $handlersByFile[substr($file, strlen($projectRoot) + 1)][] = $name;
            }
        }

        return new self(array_map(fn (array $names) => array_values(array_unique($names)), $handlersByFile));
    }

    /**
     * The files of the classes and every project class their constructors take, transitively.
     *
     * @param  list<string>  $classes
     * @return list<string>
     */
    private static function reachedFrom(array $classes): array
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
                continue;
            }

            $seen[$class] = true;
            $files[] = $declaration->fileName()->getOrElse('');
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

    private static function isProjectClass(string $class): bool
    {
        return str_starts_with($class, 'App\\') || str_starts_with($class, 'Domain\\');
    }
}
