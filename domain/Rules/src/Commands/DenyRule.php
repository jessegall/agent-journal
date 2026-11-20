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
#[Operation('deny_rule', ResourceAreaType::JournalContent, AccessType::Edit)]
final readonly class DenyRule extends Command implements AuthorizedCommand
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
