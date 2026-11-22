<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\LimitedItem;

use App\Enums\AccessType;
use App\Attributes\Authorize;
use App\Support\Command;
use Spatie\LaravelData\Attributes\Validation\Between;
use Spatie\LaravelData\Attributes\Validation\Max;
use Tests\Fixtures\Bus\Models\FixtureWork;
use Tests\Fixtures\Bus\Policies\FixturePolicy;

/**
 * A command whose text, number and list each carry a limit.
 *
 * @extends Command<mixed>
 */
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final readonly class LimitedItemCommand extends Command
{
    /**
     * @param  list<string>  $tags
     */
    public function __construct(
        #[Max(5)]
        public string $label,
        #[Between(1, 10)]
        public int $count,
        #[Max(3)]
        public array $tags,
        public string $note = '',
    ) {}
}
