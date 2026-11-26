<?php

declare(strict_types=1);

namespace App\Scripts\Contracts;

use App\Values\CompiledScript;
use App\Values\ProfileDefinition;
use App\Values\ScriptSource;

interface ScriptCompilation
{
    /**
     * The script source compiled into the steps a run follows.
     */
    public function compile(ScriptSource $source): CompiledScript;

    /**
     * The script source compiled for the profile, so its commands are checked against what the profile may run.
     */
    public function compileForProfile(ScriptSource $source, ProfileDefinition $profile): CompiledScript;
}
