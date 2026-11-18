<?php

declare(strict_types=1);

namespace Domain\Rules\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use Domain\Rules\Handlers\DenyRuleHandler;

/**
 * The user denies a proposed rule, so it never holds.
 *
 * @implements Command<null>
 */
#[HandledBy(DenyRuleHandler::class)]
#[RequiresActor(ActorType::User)]
final readonly class DenyRule implements Command
{
    public function __construct(public int $ruleId) {}
}
