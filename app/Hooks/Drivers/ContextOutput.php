<?php

declare(strict_types=1);

namespace App\Hooks\Drivers;

use Spatie\LaravelData\Data;

/**
 * Context for the agent to read, attached to the hook event it answers.
 */
final class ContextOutput extends Data
{
    public function __construct(
        public readonly string $hookEventName,
        public readonly string $additionalContext,
    ) {}
}
