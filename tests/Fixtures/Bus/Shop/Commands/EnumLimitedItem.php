<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use Spatie\LaravelData\Attributes\Validation\Max;
use Tests\Fixtures\Bus\Enums\FixtureAbility;
use Tests\Fixtures\Bus\Models\FixtureWork;
use Tests\Fixtures\Bus\Policies\FixturePolicy;
use Tests\Fixtures\Bus\Shop\Enums\ItemSize;
use Tests\Fixtures\Bus\Shop\Handlers\EnumLimitedItemHandler;

/**
 * A command with a limit on an enum, whose cases already limit it.
 *
 * @implements Command<mixed>
 */
#[HandledBy(EnumLimitedItemHandler::class)]
#[Authorize(FixturePolicy::class, FixtureAbility::Work)]
final readonly class EnumLimitedItem implements Command, HasAuthorizationSubject
{
    public function __construct(#[Max(5)] public ItemSize $size) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return FixtureWork::class;
    }
}
