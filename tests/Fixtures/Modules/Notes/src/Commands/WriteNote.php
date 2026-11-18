<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Tests\Fixtures\Modules\Notes\Handlers\WriteNoteHandler;

/**
 * @implements Command<int>
 */
#[HandledBy(WriteNoteHandler::class)]
final readonly class WriteNote implements Command
{
    public function __construct(public string $text) {}
}
