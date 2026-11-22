<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\FactOrigin;

/**
 * A fact that comes from a saved alias's body: the alias, its id and revision, beside the origin of the fact inside it.
 */
final readonly class AliasOrigin implements FactOrigin
{
    public function __construct(public AliasLookup $alias, public FactOrigin $inner) {}

    public function reference(): string
    {
        return "{$this->alias->reference()} via {$this->inner->reference()}";
    }
}
