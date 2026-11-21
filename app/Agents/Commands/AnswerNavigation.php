<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Policies\AgentPolicy;
use App\Agents\Values\DriverReceipt;
use App\Agents\Values\NavigationAnswer;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * One round of the main agent on a stalled runtime's screen, answering the navigation request at the row version and
 * screen generation it read: keys, a label to choose, a seen label to confirm, or a goal parameter to type.
 *
 * @extends Command<DriverReceipt>
 */
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class AnswerNavigation extends Command
{
    public function __construct(
        public string $navigationId,
        public int $expectedRowVersion,
        public int $generation,
        public NavigationAnswer $answer,
    ) {}
}
