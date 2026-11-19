<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Tests\Fixtures\Modules\Notes\Handlers\EngineCopyNoteHandler;

/**
 * An engine command that runs WriteNote, which does not allow the engine, as a nested command.
 *
 * @implements Command<int>
 */
#[HandledBy(EngineCopyNoteHandler::class)]
final readonly class EngineCopyNote implements Command
{
    public function __construct(public string $text) {}
}
