<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Policies;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Policy;
use BackedEnum;

/**
 * The policy of the bus and module fixture commands: every granted actor may run them, so the grants decide.
 */
final readonly class FixturePolicy implements Policy
{
    /**
     * @param  object|class-string  $subject
     */
    public function authorize(Actor $actor, object|string $subject, BackedEnum $ability): void {}
}
