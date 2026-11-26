<?php

declare(strict_types=1);

namespace App\Terminals\Commands\ChangeLayout;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\LayoutPolicy;
use App\Support\Command;
use App\Terminals\Data\LayoutShape;

/**
 * The calling user gives one of their layouts a new name and shape.
 *
 * @extends Command<null>
 */
#[Authorize(LayoutPolicy::class, AccessType::Edit)]
final readonly class ChangeLayoutCommand extends Command
{
    public function __construct(
        public string $layoutId,
        public string $name,
        public LayoutShape $shape,
    ) {}
}
