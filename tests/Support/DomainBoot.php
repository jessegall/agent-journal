<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Support\Domain;

/**
 * The domains a test boots: the domains it names and every domain they require, directly or through another.
 */
final readonly class DomainBoot
{
    /**
     * @param  class-string<Domain>  ...$domains
     * @return list<class-string<Domain>>
     */
    public static function withRequirements(string ...$domains): array
    {
        $booted = [];
        $pending = $domains;

        while ($pending !== []) {
            $next = array_shift($pending);

            if (in_array($next, $booted, true)) {
                continue;
            }

            $booted[] = $next;
            array_push($pending, ...new $next()->requires());
        }

        return $booted;
    }
}
