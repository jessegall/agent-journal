<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\LooseItem;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Bus\Contracts\Command;
use App\Exceptions\CommandDispatcherMissing;
use App\Support\ActorReference;
use Tests\Fixtures\Bus\Policies\FixturePolicy;

/**
 * A command that is neither readonly nor built on the base: it loads, and the registry refuses it as not readonly.
 *
 * @implements Command<mixed>
 */
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final class LooseItemCommand implements Command
{
    private ActorReference|null $dispatcher = null;

    public function __construct() {}

    public function dispatchedBy(): ActorReference
    {
        if ($this->dispatcher === null) {
            throw CommandDispatcherMissing::forCommand(self::class);
        }

        return $this->dispatcher;
    }

    public function withDispatcher(ActorReference $dispatcher): static
    {
        $copy = clone $this;
        $copy->dispatcher = $dispatcher;

        return $copy;
    }
}
