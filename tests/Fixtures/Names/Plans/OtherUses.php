<?php

declare(strict_types=1);

namespace Tests\Fixtures\Names\Plans;

use Tests\Fixtures\Names\Chat\ChatFailed;
use Tests\Fixtures\Names\Chat\Escaping;
use Tests\Fixtures\Names\Chat\Formatting;
use Tests\Fixtures\Names\Chat\Message;
use Tests\Fixtures\Names\Chat\Notifier;
use Tests\Fixtures\Names\Chat\Shared;

#[Shared]
final class OtherUses extends Message implements Notifier
{
    use Escaping, Formatting {
        Formatting::format insteadof Escaping;
    }

    public function check(object $value): bool
    {
        try {
            if (! $value instanceof Message) {
                throw new ChatFailed();
            }

            return true;
        } catch (ChatFailed) {
            return false;
        }
    }
}
