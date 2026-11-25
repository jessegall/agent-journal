<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\BaselessItem;

use App\Attributes\Commands\Authorize;
use App\Contracts\Bus\Command;
use App\Enums\Agents\AccessType;
use App\Exceptions\CommandDispatcherMissing;
use App\Support\ActorReference;
use Tests\Fixtures\Bus\Policies\FixturePolicy;

/**
 * A final readonly command that implements the interface itself instead of extending the base command.
 *
 * @implements Command<mixed>
 */
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final readonly class BaselessItemCommand implements Command
{
    public function __construct() {}

    public function dispatchedBy(): ActorReference
    {
        throw CommandDispatcherMissing::forCommand(self::class);
    }

    public function withDispatcher(ActorReference $dispatcher): static
    {
        return $this;
    }
}
