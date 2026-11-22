<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Events\Event;

/**
 * Links were removed, raised inside the transaction that removed them, so whatever rested on those exact links ends
 * with them. A link made again between the same records has a new id.
 */
final readonly class LinksRemoved implements Event
{
    /**
     * @param  list<string>  $linkIds
     */
    public function __construct(public array $linkIds) {}
}
