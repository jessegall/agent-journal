<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\ApproveRuleBundleHandler;

/**
 * A project owner activates one installed module's rule bundle at the exact version and digest they reviewed.
 *
 * @implements Command<string>
 */
#[HandledBy(ApproveRuleBundleHandler::class)]
#[RequiresActor(ActorType::User)]
final readonly class ApproveRuleBundle implements Command
{
    public function __construct(public string $module, public string $version, public string $digest) {}
}
