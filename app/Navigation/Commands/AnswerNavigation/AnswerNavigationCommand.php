<?php

declare(strict_types=1);

namespace App\Navigation\Commands\AnswerNavigation;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Navigation\Values\NavigationAnswer;
use App\Policies\AgentPolicy;
use App\Support\Command;
use App\Values\DriverReceipt;

/**
 * One round of the main agent on a stalled runtime's screen, answering the navigation request at the row version and
 * screen generation it read: keys, a label to choose, a seen label to confirm, or a goal parameter to type.
 *
 * @extends Command<DriverReceipt>
 */
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class AnswerNavigationCommand extends Command
{
    public function __construct(
        public string $navigationId,
        public int $expectedRowVersion,
        public int $generation,
        public NavigationAnswer $answer,
    ) {}
}
