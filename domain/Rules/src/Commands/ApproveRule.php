<?php

declare(strict_types=1);

namespace Domain\Rules\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use Domain\Rules\Handlers\ApproveRuleHandler;

/**
 * The user approves a proposed rule, so it holds from now on.
 *
 * @implements Command<null>
 */
#[HandledBy(ApproveRuleHandler::class)]
#[RequiresActor(ActorType::User)]
final readonly class ApproveRule implements Command
{
    public function __construct(public string $ruleId) {}
}
