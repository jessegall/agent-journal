<?php

declare(strict_types=1);

namespace Domain\Rules\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Rules\Handlers\RemoveRuleHandler;
use Domain\Rules\Policies\RulePolicy;

/**
 * Ends a rule, so it no longer holds. Only the user may: an agent is refused on every surface.
 *
 * @extends Command<null>
 */
#[HandledBy(RemoveRuleHandler::class)]
#[Authorize(RulePolicy::class, AccessType::Delete)]
final readonly class RemoveRule extends Command
{
    public function __construct(public string $ruleId) {}
}
