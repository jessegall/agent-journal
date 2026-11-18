<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use App\Core\Actors\Enums\ActorType;
use App\Core\Bus\Attributes\HandledBy;
use App\Core\Bus\Attributes\RepeatableRead;
use App\Core\Bus\Attributes\RequiresActor;
use App\Core\Bus\Contracts\Command;
use Tests\Fixtures\Bus\Shop\Enums\ItemSize;
use Tests\Fixtures\Bus\Shop\Handlers\AddItemHandler;

/**
 * @implements Command<int>
 */
#[HandledBy(AddItemHandler::class)]
#[RepeatableRead]
#[RequiresActor(ActorType::User)]
final readonly class AddItem implements Command
{
    /**
     * @param  list<string>  $tags
     */
    public function __construct(public int $itemId, public ItemSize $size, public array $tags, public string|null $note = null) {}
}
