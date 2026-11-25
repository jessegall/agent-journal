<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\MisnamedFieldItem;

use App\Enums\Agents\AccessType;
use App\Attributes\Commands\Authorize;
use App\Support\Command;
use Spatie\LaravelData\Attributes\Validation\RequiredWithout;
use Tests\Fixtures\Bus\Models\FixtureWork;
use Tests\Fixtures\Bus\Policies\FixturePolicy;

/**
 * A command with a rule naming a field it does not have.
 *
 * @extends Command<mixed>
 */
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final readonly class MisnamedFieldItemCommand extends Command
{
    public function __construct(
        #[RequiredWithout('breif')]
        public string|null $title = null,
        public string|null $brief = null,
    ) {}
}
