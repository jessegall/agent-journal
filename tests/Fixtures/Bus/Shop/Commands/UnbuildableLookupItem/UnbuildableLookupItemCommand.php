<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\UnbuildableLookupItem;

use App\Attributes\Authorize;
use App\Support\Command;
use App\Enums\AccessType;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Tests\Fixtures\Bus\Policies\FixturePolicy;

/**
 * A command with a rule that reads the database and whose constructor throws when built, since it names no table:
 * its refusal shows the rule was refused by name before it was ever built.
 *
 * @extends Command<mixed>
 */
#[Authorize(FixturePolicy::class, AccessType::Read)]
final readonly class UnbuildableLookupItemCommand extends Command
{
    public function __construct(
        #[Exists]
        public int $itemId,
    ) {}
}
