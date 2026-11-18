<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use Tests\Fixtures\Modules\Notes\Handlers\SystemNoteHandler;

/**
 * @implements Command<int>
 */
#[HandledBy(SystemNoteHandler::class)]
#[RequiresActor(ActorType::System)]
final readonly class SystemNote implements Command
{
    public function __construct(public string $text) {}
}
