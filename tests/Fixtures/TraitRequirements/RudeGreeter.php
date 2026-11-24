<?php

declare(strict_types=1);

namespace Tests\Fixtures\TraitRequirements;

/**
 * Uses the greeting trait without implementing what it needs.
 */
final class RudeGreeter
{
    use SaysHello;
}
