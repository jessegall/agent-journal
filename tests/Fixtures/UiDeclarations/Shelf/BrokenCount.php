<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Shelf;

use App\Ui\Contracts\CountResolver;
use RuntimeException;

final class BrokenCount implements CountResolver
{
    public function count(): int
    {
        throw new RuntimeException('The count query failed.');
    }
}
