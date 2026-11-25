<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\ClosureItem;

use Tests\Fixtures\Bus\Policies\FixturePolicy;
use App\Enums\Agents\AccessType;
use App\Attributes\Commands\Authorize;
use App\Support\Command;

/**
 * @extends Command<mixed>
 */
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final readonly class ClosureItemCommand extends Command
{
    public function __construct(public \Closure $callback) {}
}
