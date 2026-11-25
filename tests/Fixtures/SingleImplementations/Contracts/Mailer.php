<?php

declare(strict_types=1);

namespace Tests\Fixtures\SingleImplementations\Contracts;

/**
 * A contract one class implements under its own name.
 */
interface Mailer
{
    public function send(string $text): void;
}
