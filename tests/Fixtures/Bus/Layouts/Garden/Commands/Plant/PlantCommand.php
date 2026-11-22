<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Layouts\Garden\Commands\Plant;

use App\Attributes\Authorize;
use App\Support\Command;
use App\Enums\AccessType;
use Tests\Fixtures\Bus\Policies\FixturePolicy;

/**
 * A command of the layout fixture: an old-layout copy of the final Plant pair.
 *
 * @extends Command<mixed>
 */
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final readonly class PlantCommand extends Command
{
    public function __construct() {}
}
