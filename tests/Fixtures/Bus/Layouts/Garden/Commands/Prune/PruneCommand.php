<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Layouts\Garden\Commands\Prune;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Tests\Fixtures\Bus\Policies\FixturePolicy;

/**
 * A command of the layout fixture: a pair in an old area's own Commands folder.
 *
 * @extends Command<mixed>
 */
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final readonly class PruneCommand extends Command
{
    public function __construct() {}
}
