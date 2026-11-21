<?php

declare(strict_types=1);

namespace App\Hooks\Commands;

use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * Marks the frame the engine runs this for as one whose instruction the agent sees, under its state type's instruction type. It names no target, frame or subject: the engine's origin does.
 *
 * @extends Command<null>
 */
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class FocusInstruction extends Command {}
