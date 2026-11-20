<?php

declare(strict_types=1);

namespace App\Communication\Contracts;

use PhpOption\Option;

/**
 * An inbox provider whose inboxes can be found by a stable name, such as the desk named main.
 */
interface NamedInboxes
{
    /**
     * @return Option<Inbox>
     */
    public function inboxNamed(string $name): Option;
}
