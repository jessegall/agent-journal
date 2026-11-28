<?php

declare(strict_types=1);

namespace App\Web\Creation;

use App\Navigation\Contracts\PresentsLayout;
use App\Navigation\Contracts\RecordWindow;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\RecordLayoutData;
use App\Support\RecordIdentity;
use PhpOption\Option;
use Spatie\LaravelData\Attributes\Hidden;
use Spatie\LaravelData\Data;

abstract class RecordPageData extends Data implements PresentsLayout, RecordWindow
{
    /** Holds the checked layout and the identity used to offer its record. */
    public function __construct(#[Hidden] public readonly RecordLayoutData $shown) {}

    /** Returns the browser tree without the server-only record. */
    final public function layout(): DeclaredLayoutData
    {
        return $this->shown->layout();
    }

    /** @return Option<RecordIdentity> The record available to the window offer. */
    final public function shownRecord(): Option
    {
        return $this->shown->shownRecord();
    }
}
