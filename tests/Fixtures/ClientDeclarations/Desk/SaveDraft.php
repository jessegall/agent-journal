<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Desk;

final class SaveDraft
{
    public function __invoke(): string
    {
        return 'saved';
    }
}
