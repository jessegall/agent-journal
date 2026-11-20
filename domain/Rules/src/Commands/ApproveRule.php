<?php

declare(strict_types=1);

namespace Domain\Rules\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use Domain\Rules\Enums\RuleAbility;
use Domain\Rules\Handlers\ApproveRuleHandler;
use Domain\Rules\Models\Rule;
use Domain\Rules\Policies\RulePolicy;

/**
 * The user approves a proposed rule, so it holds from now on.
 *
 * @extends Command<null>
 */
#[HandledBy(ApproveRuleHandler::class)]
#[Authorize(RulePolicy::class, RuleAbility::Approve)]
#[Operation('approve_rule', ResourceAreaType::JournalContent, AccessType::Edit)]
final readonly class ApproveRule extends Command implements AuthorizedCommand
{
    public function __construct(public string $ruleId) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Rule::class;
    }
}
