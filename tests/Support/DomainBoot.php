<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Support\Domain;

/**
 * The domains a domain's tests boot: the domain itself and every domain it requires, directly or through another.
 */
final readonly class DomainBoot
{
    /**
     * @param  class-string<Domain>  $domain
     * @return list<class-string<Domain>>
     */
    public static function withRequirements(string $domain): array
    {
        $booted = [];
        $pending = [$domain];

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
