<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Handlers;

use Tests\Fixtures\Bus\Shop\Commands\UnreadableRuleItem;

final class UnreadableRuleItemHandler
{
    public function handle(UnreadableRuleItem $command): void {}
}
