<?php

declare(strict_types=1);

namespace App\Attributes\Commands;

use Attribute;

/**
 * A command whose request key belongs to the authenticated actor, across every session it runs in: a retry from
 * another session gets the same answer for the days given, and the key stays refused for good after that.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class RetainedActorRequestKey
{
    public function __construct(public int $answerDays = 30) {}
}
