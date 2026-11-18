<?php

declare(strict_types=1);

namespace Domain\Rules\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use Domain\Rules\Handlers\RemoveRuleHandler;

/**
 * Ends a rule, so it no longer holds. Only the user may: an agent is refused on every surface.
 *
 * @implements Command<null>
 */
#[HandledBy(RemoveRuleHandler::class)]
#[RequiresActor(ActorType::User)]
final readonly class RemoveRule implements Command
{
    public function __construct(public string $ruleId) {}
}
