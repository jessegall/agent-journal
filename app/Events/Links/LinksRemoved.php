<?php

declare(strict_types=1);

namespace App\Events\Links;

use App\Attributes\Listeners\TransactionListenerConsent;

/**
 * Links were removed, raised inside the transaction that removed them, so whatever rested on those exact links ends
 * with them. A link made again between the same records has a new id.
 */
#[TransactionListenerConsent]
final readonly class LinksRemoved implements LinkEvent
{
    /**
     * @param  list<string>  $linkIds
     */
    public function __construct(public array $linkIds) {}
}
