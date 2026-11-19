<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\Command;
use Tests\Fixtures\Modules\Notes\Handlers\RetainNoteHandler;

/**
 * A write whose request key belongs to its actor across sessions: answered for 30 days, refused for good after.
 *
 * @implements Command<int>
 */
#[HandledBy(RetainNoteHandler::class)]
#[RetainedActorRequestKey]
final readonly class RetainNote implements Command
{
    public function __construct(public string $text) {}
}
