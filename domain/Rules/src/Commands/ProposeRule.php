<?php

declare(strict_types=1);

namespace Domain\Rules\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use Domain\Rules\Enums\RuleAbility;
use Domain\Rules\Handlers\ProposeRuleHandler;
use Domain\Rules\Models\Rule;
use Domain\Rules\Policies\RulePolicy;

/**
 * Proposes a rule with its text; it holds only once the user approves it.
 *
 * @extends Command<string>
 */
#[HandledBy(ProposeRuleHandler::class)]
#[Authorize(RulePolicy::class, RuleAbility::Propose)]
final readonly class ProposeRule extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $text,
        public string $reason,
        public string|null $replacesRuleId = null,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Rule::class;
    }
}
