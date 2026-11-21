<?php

declare(strict_types=1);

namespace App\Hooks\Commands;

use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * Forgets the instruction marker of the frame the engine runs this for. It names no target, frame or subject: the engine's origin does.
 *
 * @extends Command<null>
 */
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class ReleaseInstruction extends Command {}
