<?php

declare(strict_types=1);

namespace App\Profiles\Values;

/**
 * The script an activated profile revision runs: the source it was written in and what it compiled to.
 */
final readonly class ProfileScript
{
    public function __construct(public ScriptSource $source, public CompiledScript $compiled) {}
}
