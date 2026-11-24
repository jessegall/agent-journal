<?php

declare(strict_types=1);

namespace App\Contracts\Navigation;

/**
 * One option a page offers in its pane menu: a toggle, or a choice between named values.
 */
interface PageOption
{
    /**
     * The key the option is chosen by.
     */
    public function key(): string;

    /**
     * The words users see for the option.
     */
    public function label(): string;
}
