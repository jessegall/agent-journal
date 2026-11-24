<?php

declare(strict_types=1);

namespace Tests\Fixtures\Architecture\Pipes;

/**
 * The service the forwarding pipe hands its work to.
 */
interface ForwardedService
{
    public function check(object $value): void;
}
