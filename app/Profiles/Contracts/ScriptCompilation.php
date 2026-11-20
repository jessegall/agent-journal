<?php

declare(strict_types=1);

namespace App\Profiles\Contracts;

use App\Profiles\Values\CompiledScript;
use App\Profiles\Values\ProfileDefinition;
use App\Profiles\Values\ScriptSource;

interface ScriptCompilation
{
    public function compile(ScriptSource $source): CompiledScript;

    public function compileForProfile(ScriptSource $source, ProfileDefinition $profile): CompiledScript;
}
