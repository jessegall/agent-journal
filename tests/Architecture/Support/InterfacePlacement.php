<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use Tests\Support\ScanCache\ScanCache;

/**
 * An interface lives in a Contracts folder of the domain, the domain part, the core area or the core that
 * uses it; the base event of an Events folder, the interface every event of the folder implements, lives beside them.
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

        if (basename(dirname($folder)) === 'Contracts' || self::isBaseEvent($path)) {
            return true;
        }

        return basename($folder) === 'Contracts' && basename(dirname($folder)) !== 'app';
    }

    /**
     * A file named as a group's base event, such as PlanEvent.php, in a domain's Events folder or a subject folder of
     * Core's.
     */
    private static function isBaseEvent(string $path): bool
    {
        $folder = dirname($path);

        return str_ends_with(basename($path), 'Event.php')
            && (basename($folder) === 'Events' || basename(dirname($folder)) === 'Events');
    }
}
