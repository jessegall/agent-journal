<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Garden\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use Tests\Fixtures\Bus\Enums\FixtureAbility;
use Tests\Fixtures\Bus\Garden\Handlers\WaterHandler;
use Tests\Fixtures\Bus\Models\FixtureWork;
use Tests\Fixtures\Bus\Policies\FixturePolicy;

/**
 * @extends Command<mixed>
 */
#[HandledBy(WaterHandler::class)]
#[Operation('water', ResourceAreaType::JournalWork, AccessType::Edit)]
#[Authorize(FixturePolicy::class, FixtureAbility::Work)]
final readonly class Water extends Command implements HasAuthorizationSubject
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
