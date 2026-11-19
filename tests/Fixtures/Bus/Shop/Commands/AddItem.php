<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use Tests\Fixtures\Bus\Enums\FixtureAbility;
use Tests\Fixtures\Bus\Models\FixtureWork;
use Tests\Fixtures\Bus\Policies\FixturePolicy;
use Tests\Fixtures\Bus\Shop\Enums\ItemSize;
use Tests\Fixtures\Bus\Shop\Handlers\AddItemHandler;

/**
 * @implements Command<int>
 */
#[HandledBy(AddItemHandler::class)]
#[Authorize(FixturePolicy::class, FixtureAbility::Work)]
#[RepeatableRead]
final readonly class AddItem implements Command, HasAuthorizationSubject
{
    /**
     * @param  list<string>  $tags
     */
    public function __construct(public int $itemId, public ItemSize $size, public array $tags, public string|null $note = null) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return FixtureWork::class;
    }
}
