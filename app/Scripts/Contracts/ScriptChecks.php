<?php

declare(strict_types=1);

namespace App\Scripts\Contracts;

use App\Profiles\Values\ScriptSource;
use App\Scripts\Values\ScriptCheck;

interface ScriptChecks
{
    public function check(ScriptSource $source): ScriptCheck;
}
