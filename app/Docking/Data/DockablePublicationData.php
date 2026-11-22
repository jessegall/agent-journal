<?php

declare(strict_types=1);

namespace App\Docking\Data;

use App\Docking\Cards\DockIdentity;
use App\Docking\Sources\Contracts\DockableWindow;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\PresentsLayout;
use PhpOption\Option;
use PhpOption\Some;
use Spatie\LaravelData\Data;

/**
 * A publication shown as a declared layout that can be docked: the layout the browser gets, and the record it docks
 * from, which stays on the server and is offered beside the content only where its destination may be opened.
 */
final class DockablePublicationData extends Data implements DockableWindow, PresentsLayout
{
    private function __construct(
        private readonly DeclaredLayoutData $shown,
        private readonly DockIdentity $source,
    ) {}

    public static function of(DeclaredLayoutData $layout, DockIdentity $source): self
    {
        return new self($layout, $source);
    }

    public function layout(): DeclaredLayoutData
    {
        return $this->shown;
    }

    public function dockSource(): Option
    {
        return new Some($this->source);
    }
}
