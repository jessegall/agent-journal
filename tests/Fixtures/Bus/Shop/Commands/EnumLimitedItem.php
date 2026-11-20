<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use Spatie\LaravelData\Attributes\Validation\Max;
use Tests\Fixtures\Bus\Models\FixtureWork;
use Tests\Fixtures\Bus\Policies\FixturePolicy;
use Tests\Fixtures\Bus\Shop\Enums\ItemSize;
use Tests\Fixtures\Bus\Shop\Handlers\EnumLimitedItemHandler;

/**
 * A command with a limit on an enum, whose cases already limit it.
 *
 * @extends Command<mixed>
 */
#[HandledBy(EnumLimitedItemHandler::class)]
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final readonly class EnumLimitedItem extends Command
{
    public function __construct(
        #[Max(5)]
        public ItemSize $size,
    ) {}
}
