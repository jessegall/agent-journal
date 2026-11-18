<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Contracts\Command;
use Tests\Fixtures\Modules\Notes\Handlers\KeepNoteHandler;

/**
 * A write that runs only under a request key, its receipt kept 31 days and its key refused until 365.
 *
 * @implements Command<int>
 */
#[HandledBy(KeepNoteHandler::class)]
#[RequiresRequestKey(retentionDays: 31, tombstoneDays: 365)]
final readonly class KeepNote implements Command
{
    public function __construct(public string $text) {}
}
