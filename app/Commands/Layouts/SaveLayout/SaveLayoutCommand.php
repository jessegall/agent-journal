<?php

declare(strict_types=1);

namespace App\Commands\Layouts\SaveLayout;

use App\Attributes\Commands\Authorize;
use App\Data\Layouts\LayoutShape;
use App\Enums\Agents\AccessType;
use App\Policies\LayoutPolicy;
use App\Support\Command;

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
