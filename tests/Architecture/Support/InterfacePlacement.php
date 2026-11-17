<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node\Stmt\Interface_;
use PhpParser\NodeFinder;

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
        $misplaced = [];

        foreach (DomainFiles::in($folders) as $path) {
            if (basename(dirname($path)) === 'Contracts') {
                continue;
            }

            array_push($misplaced, ...self::interfacesDeclaredIn($path));
        }

        sort($misplaced);

        return $misplaced;
    }

    /**
     * @return list<string>
     */
    private static function interfacesDeclaredIn(string $path): array
    {
        $interfaces = (new NodeFinder)->findInstanceOf(ParsedFile::fromPath($path)->statements, Interface_::class);

        return array_values(array_filter(array_map(
            fn (Interface_ $interface) => $interface->namespacedName?->toString() ?? '',
            $interfaces,
        ), fn (string $name) => $name !== ''));
    }
}
