<?php

declare(strict_types=1);

namespace Domain\Rules\Commands\ProposeRule;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Projects\Contracts\ProjectCommand;
use App\Support\Command;
use App\Values\ProjectOwner;
use Domain\Rules\Models\Rule;
use Domain\Rules\Policies\RulePolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Proposes a rule of a project with its text; it holds only once the user approves it.
 *
 * @extends Command<string>
 */
#[Authorize(RulePolicy::class, AccessType::Create)]
final readonly class ProposeRuleCommand extends Command implements ProjectCommand
{
    public function __construct(
        #[Required, Max(Rule::TEXT_CHARACTER_LIMIT)]
        public string $text,
        #[Required, Max(Rule::REASON_CHARACTER_LIMIT)]
        public string $reason,
        public string $projectId,
        public string|null $replacesRuleId = null,
    ) {}

    public function owner(): ProjectOwner
    {
        return ProjectOwner::ofProject($this->projectId);
    }
}
