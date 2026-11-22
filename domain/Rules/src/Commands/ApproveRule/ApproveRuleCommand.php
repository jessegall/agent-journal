<?php

declare(strict_types=1);

namespace Domain\Rules\Commands\ApproveRule;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Support\Command;
use Domain\Rules\Policies\RulePolicy;

/**
 * The user approves a proposed rule, so it holds from now on.
 *
 * @extends Command<null>
 */
#[Authorize(RulePolicy::class, AccessType::Edit)]
final readonly class ApproveRuleCommand extends Command
{
    public function __construct(public string $ruleId) {}
}
