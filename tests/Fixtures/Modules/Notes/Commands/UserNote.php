<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use Tests\Fixtures\Modules\Notes\Handlers\UserNoteHandler;

/**
 * @implements Command<int>
 */
#[HandledBy(UserNoteHandler::class)]
#[RequiresActor(ActorType::User)]
final readonly class UserNote implements Command
{
    public function __construct(public string $text) {}
}
