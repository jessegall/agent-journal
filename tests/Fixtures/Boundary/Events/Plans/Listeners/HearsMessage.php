<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Events\Plans\Listeners;

use Tests\Fixtures\Boundary\Events\Chat\Events\MessageSent;

final class HearsMessage
{
    public function handle(MessageSent $event): void {}
}
