<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Agents\Support\LaunchReceipt;
use App\Agents\Support\ModelSelection;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Profiles\Handlers\LaunchProfileMainHandler;
use App\Profiles\Values\ProfileKey;

/**
 * A person launches a main agent from a main_agent profile, with an explicit model or the profile's default and,
 * when the profile does not pin one, a program of their choosing.
 *
 * @implements Command<LaunchReceipt>
 */
#[HandledBy(LaunchProfileMainHandler::class)]
final readonly class LaunchProfileMain implements Command
{
    public function __construct(
        public string $requestId,
        public string $agentId,
        public ProfileKey $profile,
        public ModelSelection $requested,
        public string|null $programKey,
    ) {}
}
