<?php

declare(strict_types=1);

namespace App\Support;

/**
 * The messages a reader is shown at once, by inbox and then by number.
 */
final readonly class ShownMessages
{
    /**
     * @param  list<ShownMessage>  $messages
     */
    public function __construct(public array $messages) {}
}
