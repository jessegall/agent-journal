<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Support\Reflector;
use App\Values\ScriptSource;

final readonly class ScriptDiff
{
    public function __construct(public ScriptSource $before, public ScriptSource $after) {}

    /**
     * Whether the script changed, compared by what it holds rather than by the objects that carry it.
     */
    public function isChange(): bool
    {
        return ! Reflector::propertiesMatch($this->before, $this->after);
    }
}
