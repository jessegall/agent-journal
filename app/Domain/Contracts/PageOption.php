<?php

declare(strict_types=1);

namespace App\Domain\Contracts;

/**
 * One option a page offers in its pane menu: a toggle, or a choice between named values.
 */
interface PageOption
{
    public function key(): string;

    public function label(): string;
}
