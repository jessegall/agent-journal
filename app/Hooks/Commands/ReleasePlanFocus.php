<?php

declare(strict_types=1);

namespace App\Hooks\Commands;

use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Hooks\Handlers\ReleasePlanFocusHandler;
use App\Operations\Enums\AccessType;

/**
 * Forgets the instruction marker of the plan frame the engine runs this for. It names no target, frame or subject: the engine's origin does.
 *
 * @extends Command<null>
 */
#[HandledBy(ReleasePlanFocusHandler::class)]
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class ReleasePlanFocus extends Command {}
