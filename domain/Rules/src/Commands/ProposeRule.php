<?php

declare(strict_types=1);

namespace Domain\Rules\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Rules\Handlers\ProposeRuleHandler;

/**
 * Proposes a rule with its text; it holds only once the user approves it.
 *
 * @implements Command<string>
 */
#[HandledBy(ProposeRuleHandler::class)]
final readonly class ProposeRule implements Command
{
    public function __construct(
        public string $text,
        public string $reason,
        public string|null $replacesRuleId = null,
    ) {}
}
