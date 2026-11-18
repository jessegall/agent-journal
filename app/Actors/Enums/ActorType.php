<?php

declare(strict_types=1);

namespace App\Actors\Enums;

/**
 * Who acts in a request: a launched agent through its signed hook calls, or a user through the browser.
 */
enum ActorType: string
{
    case Agent = 'agent';
    case User = 'user';
}
