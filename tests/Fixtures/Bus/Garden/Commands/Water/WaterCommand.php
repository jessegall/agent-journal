<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Garden\Commands\Water;

use App\Enums\Agents\AccessType;
use App\Attributes\Authorize;
use App\Support\Command;
use Tests\Fixtures\Bus\Models\FixtureWork;
use Tests\Fixtures\Bus\Policies\FixturePolicy;

/**
 * @extends Command<mixed>
 */
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final readonly class WaterCommand extends Command
{
    public function __construct() {}
}
