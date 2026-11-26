<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Hooks;

use Spatie\LaravelData\Data;

final class PreToolBody extends Data
{
    public function __construct(public readonly PreToolOutput $hookSpecificOutput) {}
}
