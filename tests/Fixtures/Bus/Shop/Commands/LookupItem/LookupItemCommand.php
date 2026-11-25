<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\LookupItem;

use App\Enums\Agents\AccessType;
use App\Attributes\Authorize;
use App\Support\Command;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Tests\Fixtures\Bus\Models\FixtureWork;
use Tests\Fixtures\Bus\Policies\FixturePolicy;

/**
 * A command with a rule that reads the database.
 *
 * @extends Command<mixed>
 */
#[Authorize(FixturePolicy::class, AccessType::Read)]
final readonly class LookupItemCommand extends Command
{
    public function __construct(
        #[Exists('items', 'id')]
        public int $itemId,
    ) {}
}
