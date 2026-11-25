<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\BaselessItem;

use Tests\Fixtures\Bus\Policies\FixturePolicy;
use App\Enums\Agents\AccessType;
use App\Attributes\Commands\Authorize;
use App\Support\ActorIdentity;
use App\Contracts\Bus\Command;
use App\Exceptions\CommandDispatcherMissing;

/**
 * A final readonly command that implements the interface itself instead of extending the base command.
 *
 * @implements Command<mixed>
 */
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final readonly class BaselessItemCommand implements Command
{
    public function __construct() {}

    public function dispatchedBy(): ActorIdentity
    {
        throw CommandDispatcherMissing::forCommand(self::class);
    }

    public function withDispatcher(ActorIdentity $dispatcher): static
    {
        return $this;
    }
}
