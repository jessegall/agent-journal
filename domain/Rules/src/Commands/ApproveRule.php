<?php

declare(strict_types=1);

namespace Domain\Rules\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
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
final readonly class ApproveRule extends Command implements HasAuthorizationSubject
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
