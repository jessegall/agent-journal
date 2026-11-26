<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\ApproveRuleBundle;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\ProcessAdministrationPolicy;
use App\Support\Command;

/**
 * A project owner activates one installed module's rule bundle at the exact version and digest they reviewed.
 *
 * @extends Command<string>
 */
#[Authorize(ProcessAdministrationPolicy::class, AccessType::Edit)]
final readonly class ApproveRuleBundleCommand extends Command
{
    public function __construct(public string $module, public string $version, public string $digest) {}
}
