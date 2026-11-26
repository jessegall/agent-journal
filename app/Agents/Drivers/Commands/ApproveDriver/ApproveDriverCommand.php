<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Commands\ApproveDriver;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\ProfileAdministrationPolicy;
use App\Support\Command;
use App\Values\DriverKey;

/**
 * The owner approves a third-party driver registration and the builds of it a host may run, so a host that runs one
 * of them can enroll it.
 *
 * @extends Command<void>
 */
#[Authorize(ProfileAdministrationPolicy::class, AccessType::Edit)]
final readonly class ApproveDriverCommand extends Command
{
    /**
     * @param  list<string>  $buildPins
     */
    public function __construct(
        public DriverKey $key,
        public array $buildPins,
    ) {}
}
