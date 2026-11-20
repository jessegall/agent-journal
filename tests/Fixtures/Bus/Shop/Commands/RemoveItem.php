<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use Tests\Fixtures\Bus\Models\FixtureWork;
use Tests\Fixtures\Bus\Policies\FixturePolicy;
use Tests\Fixtures\Bus\Shop\Handlers\RemoveItemHandler;

/**
 * @extends Command<mixed>
 */
#[HandledBy(RemoveItemHandler::class)]
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final readonly class RemoveItem extends Command
{
    public function __construct() {}
}
