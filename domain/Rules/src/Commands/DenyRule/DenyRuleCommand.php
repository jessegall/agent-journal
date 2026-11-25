<?php

declare(strict_types=1);

namespace Domain\Rules\Commands\DenyRule;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Rules\Policies\RulePolicy;

/**
 * The user denies a proposed rule, so it never holds.
 *
 * @extends Command<null>
 */
#[Authorize(RulePolicy::class, AccessType::Edit)]
final readonly class DenyRuleCommand extends Command
{
    public function __construct(public string $ruleId) {}
}
