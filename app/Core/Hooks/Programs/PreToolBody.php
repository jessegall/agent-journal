<?php

declare(strict_types=1);

namespace App\Core\Hooks\Programs;

use Spatie\LaravelData\Data;

final class PreToolBody extends Data
{
    public function __construct(public readonly PreToolOutput $hookSpecificOutput) {}
}
