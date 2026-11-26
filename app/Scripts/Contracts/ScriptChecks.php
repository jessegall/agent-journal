<?php

declare(strict_types=1);

namespace App\Scripts\Contracts;

use App\Values\ScriptCheck;
use App\Values\ScriptSource;

interface ScriptChecks
{
    /**
     * What is wrong with the script source, if anything, before it is saved.
     */
    public function check(ScriptSource $source): ScriptCheck;
}
