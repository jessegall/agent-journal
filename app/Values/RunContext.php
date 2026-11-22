<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\Scripts\ScriptExecution;

final readonly class RunContext
{
    public function __construct(public ScriptExecution $execution) {}
}
