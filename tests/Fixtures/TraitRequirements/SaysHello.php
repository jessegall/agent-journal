<?php

declare(strict_types=1);

namespace Tests\Fixtures\TraitRequirements;

use App\Bootstrap\Attributes\Rules\RequiresInterface;

/**
 * A trait that needs its class to implement Greets.
 */
#[RequiresInterface(Greets::class)]
trait SaysHello
{
    public function hello(): string
    {
        return 'Hello';
    }
}
