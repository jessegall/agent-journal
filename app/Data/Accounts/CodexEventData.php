<?php

declare(strict_types=1);

namespace App\Data\Accounts;

use Spatie\LaravelData\Data;

/**
 * One line `codex exec --json` prints: its type, and for a failed turn the error that ended it.
 */
final class CodexEventData extends Data
{
    public function __construct(
        public readonly string $type,
        public readonly CodexErrorData|null $error = null,
    ) {}
}
