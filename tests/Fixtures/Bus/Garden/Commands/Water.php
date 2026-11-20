<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Garden\Commands;

use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use Tests\Fixtures\Bus\Garden\Handlers\WaterHandler;
use Tests\Fixtures\Bus\Models\FixtureWork;
use Tests\Fixtures\Bus\Policies\FixturePolicy;

/**
 * @extends Command<mixed>
 */
#[HandledBy(WaterHandler::class)]
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final readonly class Water extends Command
{
    public function __construct() {}
}
