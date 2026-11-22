<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\UnreadableRuleItem;

use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use Spatie\LaravelData\Attributes\Validation\Max;
use stdClass;
use Tests\Fixtures\Bus\Models\FixtureWork;
use Tests\Fixtures\Bus\Policies\FixturePolicy;

/**
 * A command with a validation attribute whose argument no rule can be made of.
 *
 * @extends Command<mixed>
 */
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final readonly class UnreadableRuleItemCommand extends Command
{
    public function __construct(
        /**
         * @phpstan-ignore argument.type (wrong on purpose: the registry must refuse a rule it cannot read)
         */
        #[Max(new stdClass)]
        public int $count,
    ) {}
}
