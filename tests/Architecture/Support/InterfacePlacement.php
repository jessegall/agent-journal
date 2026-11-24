<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use Tests\Support\ScanCache\ScanCache;

/**
 * An interface lives in a Contracts folder of the domain, the domain part, the core area or the core that
 * uses it.
 */
final class InterfacePlacement
{
    /**
     * The interfaces under these folders that sit neither in a subject folder of a Contracts folder nor, in a domain,
     * in the Contracts folder itself: Core's contracts are grouped by subject, as app/Contracts/Agents.
     *
     * @param  list<string>  $folders
     * @return list<string>
     */
    public static function misplacedIn(array $folders): array
    {
        $paths = array_values(array_filter(DomainFiles::in($folders), fn (string $path) => ! self::isPlaced($path)));
        $misplacedInterfaces = ScanCache::findings(new InterfacesDeclared(), $paths);
        sort($misplacedInterfaces);

        return $misplacedInterfaces;
    }

    private static function isPlaced(string $path): bool
    {
        $folder = dirname($path);

        if (basename(dirname($folder)) === 'Contracts') {
            return true;
        }

        return basename($folder) === 'Contracts' && basename(dirname($folder)) !== 'app';
    }
}
