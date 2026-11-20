<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Tests\Fixtures\Bus\Enums\FixtureAbility;
use Tests\Fixtures\Bus\Models\FixtureWork;
use Tests\Fixtures\Bus\Policies\FixturePolicy;
use Tests\Fixtures\Bus\Shop\Handlers\LookupItemHandler;

/**
 * A command with a rule that reads the database.
 *
 * @extends Command<mixed>
 */
#[HandledBy(LookupItemHandler::class)]
#[Authorize(FixturePolicy::class, FixtureAbility::Work)]
#[Operation('lookup_item', ResourceAreaType::JournalWork, AccessType::Read)]
final readonly class LookupItem extends Command implements HasAuthorizationSubject
{
    public function __construct(
        #[Exists('items', 'id')]
        public int $itemId,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return FixtureWork::class;
    }
}
