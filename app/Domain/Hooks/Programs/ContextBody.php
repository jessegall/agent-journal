<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Programs;

use Spatie\LaravelData\Data;

final class ContextBody extends Data
{
    public function __construct(public readonly ContextOutput $hookSpecificOutput) {}
}
