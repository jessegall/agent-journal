<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use Spatie\LaravelData\Attributes\Validation\RequiredWithout;
use Tests\Fixtures\Bus\Enums\FixtureAbility;
use Tests\Fixtures\Bus\Models\FixtureWork;
use Tests\Fixtures\Bus\Policies\FixturePolicy;
use Tests\Fixtures\Bus\Shop\Handlers\MisnamedFieldItemHandler;

/**
 * A command with a rule naming a field it does not have.
 *
 * @extends Command<mixed>
 */
#[HandledBy(MisnamedFieldItemHandler::class)]
#[Authorize(FixturePolicy::class, FixtureAbility::Work)]
#[Operation('misnamed_field_item', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class MisnamedFieldItem extends Command implements AuthorizedCommand
{
    public function __construct(
        #[RequiredWithout('breif')]
        public string|null $title = null,
        public string|null $brief = null,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return FixtureWork::class;
    }
}
