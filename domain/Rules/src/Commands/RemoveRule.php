<?php

declare(strict_types=1);

namespace Domain\Rules\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Rules\Handlers\RemoveRuleHandler;

/**
 * Ends a rule, so it no longer holds.
 *
 * @implements Command<null>
 */
#[HandledBy(RemoveRuleHandler::class)]
final readonly class RemoveRule implements Command
{
    public function __construct(public int $ruleId) {}
}
