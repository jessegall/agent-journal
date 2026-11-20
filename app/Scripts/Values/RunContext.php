<?php

declare(strict_types=1);

namespace App\Scripts\Values;

use App\Scripts\Contracts\ScriptExecution;

final readonly class RunContext
{
    public function __construct(public ScriptExecution $execution) {}
}
