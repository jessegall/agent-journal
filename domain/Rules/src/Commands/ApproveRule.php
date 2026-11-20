<?php

declare(strict_types=1);

namespace Domain\Rules\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Rules\Handlers\ApproveRuleHandler;
use Domain\Rules\Policies\RulePolicy;

/**
 * The user approves a proposed rule, so it holds from now on.
 *
 * @extends Command<null>
 */
#[HandledBy(ApproveRuleHandler::class)]
#[Authorize(RulePolicy::class, AccessType::Edit)]
final readonly class ApproveRule extends Command
{
    public function __construct(public string $ruleId) {}
}
