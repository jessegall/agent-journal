<?php

declare(strict_types=1);

namespace App\Core\Actors;

/**
 * Who acts in a request: a launched agent through its signed hook calls, or a user through the browser.
 */
enum ActorKind: string
{
    case Agent = 'agent';
    case User = 'user';
}
