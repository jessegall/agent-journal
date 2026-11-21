<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Tests\Fixtures\Bus\Models\FixtureWork;
use Tests\Fixtures\Bus\Policies\FixturePolicy;

/**
 * A command with a rule that reads the database.
 *
 * @extends Command<mixed>
 */
#[Authorize(FixturePolicy::class, AccessType::Read)]
final readonly class LookupItem extends Command
{
    public function __construct(
        #[Exists('items', 'id')]
        public int $itemId,
    ) {}
}
