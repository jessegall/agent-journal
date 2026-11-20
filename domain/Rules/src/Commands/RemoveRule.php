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
use Domain\Rules\Handlers\RemoveRuleHandler;
use Domain\Rules\Models\Rule;
use Domain\Rules\Policies\RulePolicy;

/**
 * Ends a rule, so it no longer holds. Only the user may: an agent is refused on every surface.
 *
 * @extends Command<null>
 */
#[HandledBy(RemoveRuleHandler::class)]
#[Authorize(RulePolicy::class, RuleAbility::Remove)]
#[Operation('remove_rule', ResourceAreaType::JournalContent, AccessType::Delete)]
final readonly class RemoveRule extends Command implements AuthorizedCommand
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
