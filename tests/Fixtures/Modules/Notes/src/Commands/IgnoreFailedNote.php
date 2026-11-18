<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Tests\Fixtures\Modules\Notes\Handlers\IgnoreFailedNoteHandler;

/**
 * @implements Command<int>
 */
#[HandledBy(IgnoreFailedNoteHandler::class)]
final readonly class IgnoreFailedNote implements Command
{
    public function __construct(public string $text) {}
}
