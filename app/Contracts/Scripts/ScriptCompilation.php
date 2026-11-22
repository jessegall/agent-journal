<?php

declare(strict_types=1);

namespace App\Contracts\Scripts;

use App\Values\CompiledScript;
use App\Values\ProfileDefinition;
use App\Values\ScriptSource;

interface ScriptCompilation
{
    public function compile(ScriptSource $source): CompiledScript;

    public function compileForProfile(ScriptSource $source, ProfileDefinition $profile): CompiledScript;
}
