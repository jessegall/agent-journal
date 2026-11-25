<?php

declare(strict_types=1);

namespace App\Commands\Asks\RouteAsk;

use App\Attributes\Commands\Authorize;
use App\Attributes\Commands\Effect;
use App\Attributes\Commands\RepeatableRead;
use App\Enums\Agents\AccessType;
use App\Enums\Asks\AskRouteStatus;
use App\Enums\Engine\CommandEffectType;
use App\Policies\AskPolicy;
use App\Support\AssignmentReference;
use App\Support\Command;
use App\Values\AskReference;

/**
 * @extends Command<AskRouteStatus>
 */
#[RepeatableRead]
#[Effect(CommandEffectType::AssignmentChange)]
#[Authorize(AskPolicy::class, AccessType::Edit)]
final readonly class RouteAskCommand extends Command
{
    public function __construct(
        public AskReference $ask,
        public int $expectedVersion,
        public AssignmentReference|null $current = null,
    ) {}
}
