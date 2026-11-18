<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Skills;

use Spatie\LaravelData\Data;

/**
 * How many notes the agent must have written for notes.has-notes to match.
 */
final class HasNotesParameters extends Data
{
    public function __construct(
        public readonly int $atLeast,
    ) {}
}
