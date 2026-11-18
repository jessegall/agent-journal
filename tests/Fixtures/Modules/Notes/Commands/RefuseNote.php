<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands;

use App\Core\Bus\Attributes\HandledBy;
use App\Core\Bus\Contracts\Command;
use Tests\Fixtures\Modules\Notes\Handlers\RefuseNoteHandler;

/**
 * @implements Command<int>
 */
#[HandledBy(RefuseNoteHandler::class)]
final readonly class RefuseNote implements Command
{
    public function __construct(public string $text) {}
}
