<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\AllowsEngine;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use Tests\Fixtures\Bus\Shop\Handlers\AddItemHandler;

/**
 * A command that both allows the engine and requires a user, which no command may declare.
 *
 * @implements Command<int>
 */
#[HandledBy(AddItemHandler::class)]
#[AllowsEngine]
#[RequiresActor(ActorType::User)]
final readonly class EngineUserItem implements Command
{
    public function __construct(public int $itemId) {}
}
