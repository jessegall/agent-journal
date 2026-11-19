<?php

declare(strict_types=1);

namespace Domain\Rules\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use Domain\Rules\Enums\RuleAbility;
use Domain\Rules\Handlers\RemoveRuleHandler;
use Domain\Rules\Models\Rule;
use Domain\Rules\Policies\RulePolicy;

/**
 * Ends a rule, so it no longer holds. Only the user may: an agent is refused on every surface.
 *
 * @implements Command<null>
 */
#[HandledBy(RemoveRuleHandler::class)]
#[Authorize(RulePolicy::class, RuleAbility::Remove)]
final readonly class RemoveRule implements Command, HasAuthorizationSubject
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
