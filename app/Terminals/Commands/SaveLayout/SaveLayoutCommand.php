<?php

declare(strict_types=1);

namespace App\Terminals\Commands\SaveLayout;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\LayoutPolicy;
use App\Support\Command;
use App\Terminals\Data\LayoutShape;

/**
 * The calling user saves a new layout under a name.
 *
 * @extends Command<null>
 */
#[Authorize(LayoutPolicy::class, AccessType::Create)]
final readonly class SaveLayoutCommand extends Command
{
    public function __construct(
        public string $name,
        public LayoutShape $shape,
    ) {}
}
