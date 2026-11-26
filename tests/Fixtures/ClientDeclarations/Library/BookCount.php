<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Library;

use App\Records\Contracts\CountResolver;

final class BookCount implements CountResolver
{
    public function count(): int
    {
        return 3;
    }
}
