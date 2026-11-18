<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * The host's own name for one started execution, by which it is stopped.
 */
final readonly class ExecutionReference
{
    public function __construct(public string $id) {}
}
