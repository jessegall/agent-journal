<?php

declare(strict_types=1);

namespace App\Asks\Commands\RouteAsk;

use App\Agents\Enums\AccessType;
use App\Asks\Enums\AskRouteStatus;
use App\Attributes\Commands\Authorize;
use App\Attributes\Commands\Effect;
use App\Attributes\Commands\RepeatableRead;
use App\Engine\Enums\CommandEffectType;
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
