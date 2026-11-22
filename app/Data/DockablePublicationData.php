<?php

declare(strict_types=1);

namespace App\Data;

use App\Contracts\Navigation\PresentsLayout;
use App\Support\Cards\DockIdentity;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Sources\Contracts\DockableWindow;
use PhpOption\Option;
use PhpOption\Some;
use Spatie\LaravelData\Attributes\Hidden;
use Spatie\LaravelData\Data;

/**
 * A publication shown as a declared layout that can be docked: the layout the browser gets, and the record it docks
 * from, which stays on the server and is offered beside the content only where its destination may be opened.
 */
final class DockablePublicationData extends Data implements DockableWindow, PresentsLayout
{
    private function __construct(
        #[Hidden]
        public readonly DeclaredLayoutData $shown,
        #[Hidden]
        public readonly DockIdentity $source,
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
