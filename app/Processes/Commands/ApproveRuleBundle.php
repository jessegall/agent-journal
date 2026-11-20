<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Handlers\ApproveRuleBundleHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;

/**
 * A project owner activates one installed module's rule bundle at the exact version and digest they reviewed.
 *
 * @extends Command<string>
 */
#[HandledBy(ApproveRuleBundleHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Administer)]
#[Operation('approve_rule_bundle', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class ApproveRuleBundle extends Command implements AuthorizedCommand
{
    public function __construct(public string $module, public string $version, public string $digest) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return CommandRequest::class;
    }
}
