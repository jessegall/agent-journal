<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands;

use App\Core\Bus\Attributes\HandledBy;
use App\Core\Bus\Attributes\RepeatableRead;
use App\Core\Bus\Contracts\Command;
use Tests\Fixtures\Modules\Notes\Handlers\PinNoteHandler;

/**
 * @implements Command<string>
 */
#[HandledBy(PinNoteHandler::class)]
#[RepeatableRead]
final readonly class PinNote implements Command
{
    public function __construct(public int $rowId) {}
}
