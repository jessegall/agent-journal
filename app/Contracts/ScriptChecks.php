<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Values\ScriptCheck;
use App\Values\ScriptSource;

interface ScriptChecks
{
    public function check(ScriptSource $source): ScriptCheck;
}
