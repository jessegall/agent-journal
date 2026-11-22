<?php

declare(strict_types=1);

namespace App\Commands\RouteAsk;

use App\Attributes\Authorize;
use App\Attributes\Effect;
use App\Attributes\RepeatableRead;
use App\Enums\AccessType;
use App\Enums\AskRouteStatus;
use App\Enums\CommandEffectType;
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
