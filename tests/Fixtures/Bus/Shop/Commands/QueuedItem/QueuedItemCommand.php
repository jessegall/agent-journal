<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\QueuedItem;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Support\Command;
use Illuminate\Contracts\Queue\ShouldQueue;
use Tests\Fixtures\Bus\Policies\FixturePolicy;

/**
 * @extends Command<mixed>
 */
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final readonly class QueuedItemCommand extends Command implements ShouldQueue
{
    public function __construct() {}
}
