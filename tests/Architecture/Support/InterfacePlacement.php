<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use Tests\Support\ScanCache\ScanCache;

/**
 * Rule 17: an interface lives in a Contracts folder of the domain, the domain part, the core area or the core that
 * uses it.
 */
final class InterfacePlacement
{
    /**
     * The interfaces under these folders whose own folder is not a Contracts folder.
     *
     * @param  list<string>  $folders
     * @return list<string>
     */
    public static function misplacedIn(array $folders): array
    {
        $paths = array_values(
            array_filter(DomainFiles::in($folders), fn (string $path) => basename(dirname($path)) !== 'Contracts'),
        );
        $misplacedInterfaces = ScanCache::findings(new InterfacesDeclared(), $paths);
        sort($misplacedInterfaces);

        return $misplacedInterfaces;
    }
}
