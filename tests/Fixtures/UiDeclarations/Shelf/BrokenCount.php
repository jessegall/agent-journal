<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Shelf;

use App\Ui\Contracts\CountResolver;
use Tests\Support\Exceptions\SimulatedFailure;

final class BrokenCount implements CountResolver
{
    public function count(): int
    {
        throw SimulatedFailure::of('The count query failed.');
    }
}
