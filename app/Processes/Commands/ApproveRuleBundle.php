<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Policies\ProcessAdministrationPolicy;

/**
 * A project owner activates one installed module's rule bundle at the exact version and digest they reviewed.
 *
 * @extends Command<string>
 */
#[Authorize(ProcessAdministrationPolicy::class, AccessType::Edit)]
final readonly class ApproveRuleBundle extends Command
{
    public function __construct(public string $module, public string $version, public string $digest) {}
}
