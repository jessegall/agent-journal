<?php

declare(strict_types=1);

namespace Domain\Rules\Commands\ApproveRule;

use App\Attributes\Commands\Authorize;
use App\Contracts\Projects\ProjectCommand;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use App\Values\ProjectOwner;
use Domain\Rules\Policies\RulePolicy;

/**
 * The user approves a proposed rule for its own project or as Global, so it holds from now on.
 *
 * @extends Command<null>
 */
#[Authorize(RulePolicy::class, AccessType::Edit)]
final readonly class ApproveRuleCommand extends Command implements ProjectCommand
{
    /**
     * @param  string  $ownerKey  the proposal's own project id, or the Global key to approve it for every project
     */
    public function __construct(public string $ruleId, public string $ownerKey) {}

    public function owner(): ProjectOwner
    {
        return ProjectOwner::fromKey($this->ownerKey);
    }
}
