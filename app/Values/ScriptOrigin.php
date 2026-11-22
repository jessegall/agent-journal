<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\FactOrigin;

/**
 * A fact that comes from a line of a package script: the script binding beside the origin of the fact inside it.
 */
final readonly class ScriptOrigin implements FactOrigin
{
    public function __construct(public ScriptBinding $script, public FactOrigin $inner) {}

    public function reference(): string
    {
        return "{$this->script->reference()} via {$this->inner->reference()}";
    }
}
