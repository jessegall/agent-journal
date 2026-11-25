<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\LooseItem;

use Tests\Fixtures\Bus\Policies\FixturePolicy;
use App\Enums\Agents\AccessType;
use App\Attributes\Commands\Authorize;
use App\Support\ActorIdentity;
use App\Contracts\Bus\Command;
use App\Exceptions\CommandDispatcherMissing;

/**
 * A command that is neither readonly nor built on the base: it loads, and the registry refuses it as not readonly.
 *
 * @implements Command<mixed>
 */
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final class LooseItemCommand implements Command
{
    private ActorIdentity|null $dispatcher = null;

    public function __construct() {}

    public function dispatchedBy(): ActorIdentity
    {
        if ($this->dispatcher === null) {
            throw CommandDispatcherMissing::forCommand(self::class);
        }

        return $this->dispatcher;
    }

    public function withDispatcher(ActorIdentity $dispatcher): static
    {
        $copy = clone $this;
        $copy->dispatcher = $dispatcher;

        return $copy;
    }
}
