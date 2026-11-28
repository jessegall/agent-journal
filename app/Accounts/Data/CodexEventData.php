<?php

declare(strict_types=1);

namespace App\Accounts\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;

/**
 * One line `codex exec --json` prints: its type, the thread a started thread names, and for a failed turn or an error
 * what ended it.
 */
final class CodexEventData extends Data
{
    public function __construct(
        public readonly string $type,
        public readonly CodexErrorData|null $error = null,
        #[MapInputName('thread_id')]
        public readonly string|null $threadId = null,
        public readonly string|null $message = null,
    ) {}
}
