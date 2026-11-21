<?php

declare(strict_types=1);

namespace Domain\Rules\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Rules\Models\Rule;
use Domain\Rules\Policies\RulePolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Proposes a rule with its text; it holds only once the user approves it.
 *
 * @extends Command<string>
 */
#[Authorize(RulePolicy::class, AccessType::Create)]
final readonly class ProposeRule extends Command
{
    public function __construct(
        #[Required, Max(Rule::TEXT_CHARACTER_LIMIT)]
        public string $text,
        #[Required, Max(Rule::REASON_CHARACTER_LIMIT)]
        public string $reason,
        public string|null $replacesRuleId = null,
    ) {}
}
