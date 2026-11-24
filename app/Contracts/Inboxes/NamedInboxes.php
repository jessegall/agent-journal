<?php

declare(strict_types=1);

namespace App\Contracts\Inboxes;

use PhpOption\Option;

/**
 * An inbox provider whose inboxes can be found by a stable name, such as the desk named main.
 */
interface NamedInboxes
{
    /**
     * @return Option<LabeledInbox>
     */
    public function inboxNamed(string $name): Option;
}
