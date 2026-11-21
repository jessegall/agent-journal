<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Reflection\Support\Reflector;
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
        $misplacedExceptions = array_values(
            array_filter(
                ScanCache::findings(new ClassesDeclared(), $paths),
                fn (string $name) => Reflector::find($name)
                    ->filter(fn (Reflector $type) => $type->isSubclassOf(Throwable::class))
                    ->isDefined(),
            ),
        );
        sort($misplacedExceptions);

        return $misplacedExceptions;
    }
}
