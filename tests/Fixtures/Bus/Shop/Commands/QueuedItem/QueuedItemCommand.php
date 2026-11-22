<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\QueuedItem;

use Tests\Fixtures\Bus\Policies\FixturePolicy;
use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * @extends Command<mixed>
 */
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final readonly class QueuedItemCommand extends Command implements ShouldQueue
{
    public function __construct() {}
}
