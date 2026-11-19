<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Library;

use App\Ui\Contracts\CountResolver;

final class BookCount implements CountResolver
{
    public function count(): int
    {
        return 3;
    }
}
