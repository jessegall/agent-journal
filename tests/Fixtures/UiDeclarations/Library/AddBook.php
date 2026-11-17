<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Library;

final class AddBook
{
    public function __invoke(): string
    {
        return 'added';
    }
}
