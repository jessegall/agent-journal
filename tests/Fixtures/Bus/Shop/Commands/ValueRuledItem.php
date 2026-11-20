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
use Tests\Fixtures\Bus\Enums\FixtureAbility;
use Tests\Fixtures\Bus\Models\FixtureWork;
use Tests\Fixtures\Bus\Policies\FixturePolicy;
use Tests\Fixtures\Bus\Shop\Handlers\ValueRuledItemHandler;
use Tests\Fixtures\Bus\Shop\Values\RuledLabel;

/**
 * A command carrying a value whose property has a validation attribute.
 *
 * @extends Command<mixed>
 */
#[HandledBy(ValueRuledItemHandler::class)]
#[Authorize(FixturePolicy::class, FixtureAbility::Work)]
#[Operation('value_ruled_item', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class ValueRuledItem extends Command implements HasAuthorizationSubject
{
    public function __construct(public RuledLabel $label) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return FixtureWork::class;
    }
}
