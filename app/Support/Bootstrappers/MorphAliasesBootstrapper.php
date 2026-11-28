<?php

declare(strict_types=1);

namespace App\Support\Bootstrappers;

use App\Contracts\Domains\DomainBootstrapper;
use App\Links\MorphAliases;
use App\Support\DomainEntry;
use Illuminate\Database\Eloquent\Relations\Relation;

/**
 * Adds the domain's models to the morph map under the aliases their place gives (MorphAliases).
 */
final readonly class MorphAliasesBootstrapper implements DomainBootstrapper
{
    public function __invoke(DomainEntry $domain): void
    {
        $aliases = MorphAliases::ofDomain($domain);

        Relation::morphMap($aliases);
    }
}
