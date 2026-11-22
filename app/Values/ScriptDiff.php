<?php

declare(strict_types=1);

namespace App\Values;

final readonly class ScriptDiff
{
    public function __construct(public ScriptSource $before, public ScriptSource $after) {}
}
