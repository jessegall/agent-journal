<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use Tests\Fixtures\Bus\Policies\FixturePolicy;
use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use Tests\Fixtures\Bus\Shop\Handlers\SingletonHandler;

/**
 * @extends Command<mixed>
 */
#[HandledBy(SingletonHandler::class)]
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final readonly class SingletonItem extends Command
{
    public function __construct() {}
}
