<?php

declare(strict_types=1);

namespace App\Terminals\Commands\DeleteLayout;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\LayoutPolicy;
use App\Support\Command;

/**
 * The calling user deletes one of their layouts.
 *
 * @extends Command<null>
 */
#[Authorize(LayoutPolicy::class, AccessType::Delete)]
final readonly class DeleteLayoutCommand extends Command
{
    public function __construct(public string $layoutId) {}
}
