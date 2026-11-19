<?php

declare(strict_types=1);

namespace Domain\Rules\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use Domain\Rules\Enums\RuleAbility;
use Domain\Rules\Handlers\DenyRuleHandler;
use Domain\Rules\Models\Rule;
use Domain\Rules\Policies\RulePolicy;

/**
 * The user denies a proposed rule, so it never holds.
 *
 * @extends Command<null>
 */
#[HandledBy(DenyRuleHandler::class)]
#[Authorize(RulePolicy::class, RuleAbility::Deny)]
final readonly class DenyRule extends Command implements HasAuthorizationSubject
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
