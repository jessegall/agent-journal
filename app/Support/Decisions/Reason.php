<?php

declare(strict_types=1);

namespace App\Support\Decisions;

use App\Values\AgentText;

/**
 * The text an agent reads when a state denies a hook or holds its stop.
 */
final readonly class Reason
{
    public function __construct(public AgentText $text) {}
}
