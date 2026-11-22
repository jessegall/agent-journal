<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\AddItem;

use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Support\Command;
use Tests\Fixtures\Bus\Models\FixtureWork;
use Tests\Fixtures\Bus\Policies\FixturePolicy;
use Tests\Fixtures\Bus\Shop\Enums\ItemSize;

/**
 * @extends Command<int>
 */
#[RepeatableRead]
#[Authorize(FixturePolicy::class, AccessType::Create)]
final readonly class AddItemCommand extends Command
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
