<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Tests\Fixtures\Modules\Notes\Handlers\ClearNotesHandler;

/**
 * @implements Command<null>
 */
#[HandledBy(ClearNotesHandler::class)]
final readonly class ClearNotes implements Command
{
    public function __construct() {}
}
