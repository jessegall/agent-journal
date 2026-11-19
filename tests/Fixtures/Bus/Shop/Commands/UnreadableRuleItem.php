<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use Spatie\LaravelData\Attributes\Validation\Max;
use stdClass;
use Tests\Fixtures\Bus\Enums\FixtureAbility;
use Tests\Fixtures\Bus\Models\FixtureWork;
use Tests\Fixtures\Bus\Policies\FixturePolicy;
use Tests\Fixtures\Bus\Shop\Handlers\UnreadableRuleItemHandler;

/**
 * A command with a validation attribute whose argument no rule can be made of.
 *
 * @extends Command<mixed>
 */
#[HandledBy(UnreadableRuleItemHandler::class)]
#[Authorize(FixturePolicy::class, FixtureAbility::Work)]
final readonly class UnreadableRuleItem extends Command implements HasAuthorizationSubject
{
    public function __construct(
        /** @phpstan-ignore argument.type (wrong on purpose: the registry must refuse a rule it cannot read) */
        #[Max(new stdClass)]
        public int $count,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return FixtureWork::class;
    }
}
