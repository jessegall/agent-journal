<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Shelf;

/**
 * Records which readers ran, so a test can prove a hidden prop called none.
 */
final class ReaderCalls
{
    /**
     * @var list<string>
     */
    public array $readers = [];
}
