<?php

declare(strict_types=1);

namespace Tests\Fixtures\Listeners;

use App\Contracts\Attributes\InCommandTransaction;
use Domain\Plans\Api\Events\PlanProgressChanged;

/**
 * A Core listener the command's transaction requires.
 */
#[InCommandTransaction]
final class RequiredProgressListener
{
    public function handle(PlanProgressChanged $event): void {}
}
