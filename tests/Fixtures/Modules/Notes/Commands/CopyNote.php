<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands;

use App\Core\Bus\Attributes\HandledBy;
use App\Core\Bus\Contracts\Command;
use Tests\Fixtures\Modules\Notes\Handlers\CopyNoteHandler;

/**
 * @implements Command<int>
 */
#[HandledBy(CopyNoteHandler::class)]
final readonly class CopyNote implements Command
{
    public function __construct(public string $text) {}
}
