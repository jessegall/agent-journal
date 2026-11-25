<?php

declare(strict_types=1);

namespace Tests\Fixtures\SingleImplementations;

use Tests\Fixtures\SingleImplementations\Contracts\Mailer as MailerContract;

/**
 * The only mailer, named after its contract.
 */
final readonly class Mailer implements MailerContract
{
    public function send(string $text): void {}
}
