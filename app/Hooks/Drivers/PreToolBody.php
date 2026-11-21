<?php

declare(strict_types=1);

namespace App\Hooks\Drivers;

use Spatie\LaravelData\Data;
use App\Hooks\Drivers\PreToolOutput;

final class PreToolBody extends Data
{
    public function __construct(public readonly PreToolOutput $hookSpecificOutput) {}
}
