<?php

declare(strict_types=1);

namespace App\Commands\Layouts\DeleteLayout;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
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
