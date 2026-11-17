<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node\Stmt\Class_;
use PhpParser\NodeFinder;
use Throwable;

/**
 * Rule 14: an exception class lives in an Exceptions folder of its domain or core area.
 */
final class ExceptionPlacement
{
    /**
     * The exception classes under these folders whose own folder is not an Exceptions folder.
     *
     * @param  list<string>  $folders
     * @return list<string>
     */
    public static function misplacedIn(array $folders): array
    {
        $misplaced = [];

        foreach (DomainFiles::in($folders) as $path) {
            if (basename(dirname($path)) === 'Exceptions') {
                continue;
            }

            array_push($misplaced, ...self::exceptionsDeclaredIn($path));
        }

        sort($misplaced);

        return $misplaced;
    }

    /**
     * @return list<string>
     */
    private static function exceptionsDeclaredIn(string $path): array
    {
        $classes = (new NodeFinder)->findInstanceOf(ParsedFile::fromPath($path)->statements, Class_::class);
        $names = array_map(fn (Class_ $class) => $class->namespacedName?->toString() ?? '', $classes);

        return array_values(array_filter($names, fn (string $name) => $name !== '' && is_subclass_of($name, Throwable::class)));
    }
}
