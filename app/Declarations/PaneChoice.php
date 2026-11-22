<?php

declare(strict_types=1);

namespace App\Declarations;

/**
 * One value a pane menu choice offers, with the label shown for it.
 */
final readonly class PaneChoice
{
    public function __construct(public string $choiceKey, public string $label) {}
}
