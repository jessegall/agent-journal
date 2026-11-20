<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Support\Command;
use Tests\Fixtures\Bus\Models\FixtureWork;
use Tests\Fixtures\Bus\Policies\FixturePolicy;
use Tests\Fixtures\Bus\Shop\Enums\ItemSize;
use Tests\Fixtures\Bus\Shop\Handlers\AddItemHandler;

/**
 * @extends Command<int>
 */
#[RepeatableRead]
#[HandledBy(AddItemHandler::class)]
#[Authorize(FixturePolicy::class, AccessType::Create)]
final readonly class AddItem extends Command
{
    /**
     * @param  list<string>  $tags
     */
    public function __construct(
public int $itemId,
 public ItemSize $size,
 public array $tags,
 public string|null $note = null,
) {}
}
