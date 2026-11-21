<?php

declare(strict_types=1);

namespace App\Hooks\Commands;

use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Hooks\Handlers\FocusPlanHandler;
use App\Operations\Enums\AccessType;

/**
 * Marks the plan frame the engine runs this for as the one whose instruction the agent sees. It names no target, frame or subject: the engine's origin does.
 *
 * @extends Command<null>
 */
#[HandledBy(FocusPlanHandler::class)]
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class FocusPlan extends Command {}
