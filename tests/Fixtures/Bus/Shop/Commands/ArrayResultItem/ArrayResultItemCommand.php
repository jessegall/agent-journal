<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\ArrayResultItem;

use Tests\Fixtures\Bus\Policies\FixturePolicy;
use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;

/**
 * @extends Command<mixed>
 */
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final readonly class ArrayResultItemCommand extends Command
{
    public function __construct() {}
}
