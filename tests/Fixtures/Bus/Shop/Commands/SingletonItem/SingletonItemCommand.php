<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\SingletonItem;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Support\Command;
use Tests\Fixtures\Bus\Policies\FixturePolicy;

/**
 * @extends Command<mixed>
 */
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final readonly class SingletonItemCommand extends Command
{
    public function __construct() {}
}
