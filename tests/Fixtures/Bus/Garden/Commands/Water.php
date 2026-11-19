<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Garden\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use Tests\Fixtures\Bus\Enums\FixtureAbility;
use Tests\Fixtures\Bus\Garden\Handlers\WaterHandler;
use Tests\Fixtures\Bus\Models\FixtureWork;
use Tests\Fixtures\Bus\Policies\FixturePolicy;

/**
 * @implements Command<mixed>
 */
#[HandledBy(WaterHandler::class)]
#[Authorize(FixturePolicy::class, FixtureAbility::Work)]
final readonly class Water implements Command, HasAuthorizationSubject
{
    public function __construct() {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return FixtureWork::class;
    }
}
