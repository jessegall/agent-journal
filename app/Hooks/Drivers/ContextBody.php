<?php

declare(strict_types=1);

namespace App\Hooks\Drivers;

use Spatie\LaravelData\Data;
use App\Hooks\Drivers\ContextOutput;

final class ContextBody extends Data
{
    public function __construct(public readonly ContextOutput $hookSpecificOutput) {}
}
