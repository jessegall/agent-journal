<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use Tests\Support\ScanCache\ScanCache;
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
        $paths = array_values(
            array_filter(DomainFiles::in($folders), fn (string $path) => basename(dirname($path)) !== 'Exceptions'),
        );
        $misplaced = array_values(
            array_filter(
                ScanCache::findings(new ClassesDeclared(), $paths),
                fn (string $name) => is_subclass_of($name, Throwable::class),
            ),
        );
        sort($misplaced);

        return $misplaced;
    }
}
