<?php

declare(strict_types=1);

namespace App\Support\Bootstrappers;

use App\Contracts\Domains\DomainBootstrapper;
use App\Support\DomainEntry;
use App\Support\MorphAliases;
use Illuminate\Database\Eloquent\Relations\Relation;

/**
 * Adds the domain's models to the morph map under the aliases their place gives (MorphAliases).
 */
final readonly class RegisterMorphAliases implements DomainBootstrapper
{
    public function __invoke(DomainEntry $domain): void
    {
        $aliases = MorphAliases::ofDomain($domain);

        Relation::morphMap($aliases);
    }
}
