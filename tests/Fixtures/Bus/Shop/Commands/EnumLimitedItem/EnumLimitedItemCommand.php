<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\EnumLimitedItem;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Support\Command;
use Spatie\LaravelData\Attributes\Validation\Max;
use Tests\Fixtures\Bus\Policies\FixturePolicy;
use Tests\Fixtures\Bus\Shop\Enums\ItemSize;

/**
 * A command with a limit on an enum, whose cases already limit it.
 *
 * @extends Command<mixed>
 */
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final readonly class EnumLimitedItemCommand extends Command
{
    public function __construct(
        #[Max(5)]
        public ItemSize $size,
    ) {}
}
