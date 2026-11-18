<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\RetireCommandRuleHandler;

/**
 * A project owner retires an active rule at the revision they expect; processes already started are untouched.
 *
 * @implements Command<string>
 */
#[HandledBy(RetireCommandRuleHandler::class)]
#[RequiresActor(ActorType::User)]
final readonly class RetireCommandRule implements Command
{
    public function __construct(
        public string $classificationRuleId,
        public int $expectedRevision,
        public string $reason,
    ) {}
}
