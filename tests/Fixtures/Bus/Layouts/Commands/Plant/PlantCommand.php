<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Layouts\Commands\Plant;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Tests\Fixtures\Bus\Policies\FixturePolicy;

/**
 * A command of the layout fixture: a pair in the final Commands layout.
 *
 * @extends Command<mixed>
 */
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final readonly class PlantCommand extends Command
{
    public function __construct() {}
}
