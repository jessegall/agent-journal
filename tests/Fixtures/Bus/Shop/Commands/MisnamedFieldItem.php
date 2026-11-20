<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use Spatie\LaravelData\Attributes\Validation\RequiredWithout;
use Tests\Fixtures\Bus\Models\FixtureWork;
use Tests\Fixtures\Bus\Policies\FixturePolicy;
use Tests\Fixtures\Bus\Shop\Handlers\MisnamedFieldItemHandler;

/**
 * A command with a rule naming a field it does not have.
 *
 * @extends Command<mixed>
 */
#[HandledBy(MisnamedFieldItemHandler::class)]
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final readonly class MisnamedFieldItem extends Command
{
    public function __construct(
        #[RequiredWithout('breif')]
        public string|null $title = null,
        public string|null $brief = null,
    ) {}
}
