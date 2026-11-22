<?php

declare(strict_types=1);

namespace Domain\Rules\Commands\RemoveRule;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Support\Command;
use Domain\Rules\Policies\RulePolicy;

/**
 * Ends a rule, so it no longer holds. Only the user may: an agent is refused on every surface.
 *
 * @extends Command<null>
 */
#[Authorize(RulePolicy::class, AccessType::Delete)]
final readonly class RemoveRuleCommand extends Command
{
    public function __construct(public string $ruleId) {}
}
