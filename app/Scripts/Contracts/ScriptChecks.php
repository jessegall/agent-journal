<?php

declare(strict_types=1);

namespace App\Scripts\Contracts;

use App\Profiles\Values\ScriptSource;
use App\Scripts\Support\ScriptChecker;
use App\Scripts\Values\ScriptCheck;
use Illuminate\Container\Attributes\Bind;

#[Bind(ScriptChecker::class)]
interface ScriptChecks
{
    public function check(ScriptSource $source): ScriptCheck;
}
