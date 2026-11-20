<?php

declare(strict_types=1);

namespace App\Supervision\Commands;

use App\Assignments\Support\AssignmentReference;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\Effect;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Enums\CommandEffectType;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Supervision\Enums\AskAbility;
use App\Supervision\Enums\AskRouteStatus;
use App\Supervision\Handlers\RouteAskHandler;
use App\Supervision\Models\Ask;
use App\Supervision\Policies\AskPolicy;
use App\Supervision\Values\AskReference;

/** @extends Command<AskRouteStatus> */
#[RepeatableRead]
#[HandledBy(RouteAskHandler::class)]
#[Effect(CommandEffectType::AssignmentChange)]
#[Authorize(AskPolicy::class, AskAbility::Work)]
#[Operation('route_ask', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class RouteAsk extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public AskReference $ask,
        public int $expectedVersion,
        public AssignmentReference|null $current = null,
    ) {}

    /** @return class-string<Ask> */
    public function subject(): string
    {
        return Ask::class;
    }
}
