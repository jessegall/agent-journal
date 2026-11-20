<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use Tests\Fixtures\Bus\Policies\FixturePolicy;
use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Actors\Support\ActorContext;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Exceptions\CommandDispatcherMissing;
use Tests\Fixtures\Bus\Shop\Handlers\RemoveItemHandler;

/**
 * A final readonly command that implements the interface itself instead of extending the base command.
 *
 * @implements Command<mixed>
 */
#[HandledBy(RemoveItemHandler::class)]
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final readonly class BaselessItem implements Command
{
    public function __construct() {}

    public function dispatchedBy(): ActorContext
    {
        throw CommandDispatcherMissing::forCommand(self::class);
    }

    public function withDispatcher(ActorContext $dispatcher): static
    {
        return $this;
    }
}
