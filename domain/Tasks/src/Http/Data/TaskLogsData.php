<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A task's Logs as the reader asked for them: always the newest page, so a refresh shows what arrived, and the older
 * page before a cursor when the reader asked for one.
 */
#[TypeScript]
final class TaskLogsData extends Data
{
    public function __construct(
        public readonly TaskStreamPageData $newest,
        public readonly TaskStreamPageData|Optional $older = new Optional(),
    ) {}
}
