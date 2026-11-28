<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Navigation\Contracts\PresentsLayout;
use App\Navigation\Contracts\RecordWindow;
use App\Support\RecordIdentity;
use App\Web\Creation\Buildable;
use PhpOption\Option;
use PhpOption\Some;
use Spatie\LaravelData\Attributes\Hidden;
use Spatie\LaravelData\Data;

/**
 * A record's page shown as a declared layout: the layout the browser gets, and the record it shows, which stays on the
 * server so the window can offer what an installed domain offers for that record.
 */
final class RecordLayoutData extends Data implements PresentsLayout, RecordWindow
{
    /** @use Buildable<RecordLayoutDataFields> */
    use Buildable;

    protected const string FIELDS = RecordLayoutDataFields::class;

    public function __construct(
        #[Hidden]
        public readonly DeclaredLayoutData $shown,
        #[Hidden]
        public readonly RecordIdentity $record,
    ) {}

    public function layout(): DeclaredLayoutData
    {
        return $this->shown;
    }

    public function shownRecord(): Option
    {
        return new Some($this->record);
    }
}
