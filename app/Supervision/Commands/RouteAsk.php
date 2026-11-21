<?php

declare(strict_types=1);

namespace App\Supervision\Commands;

use App\Assignments\Support\AssignmentReference;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\Effect;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Enums\CommandEffectType;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Supervision\Enums\AskRouteStatus;
use App\Supervision\Policies\AskPolicy;
use App\Supervision\Values\AskReference;

/**
 * @extends Command<AskRouteStatus>
 */
#[RepeatableRead]
#[Effect(CommandEffectType::AssignmentChange)]
#[Authorize(AskPolicy::class, AccessType::Edit)]
final readonly class RouteAsk extends Command
{
    public function __construct(
        public AskReference $ask,
        public int $expectedVersion,
        public AssignmentReference|null $current = null,
    ) {}
}
