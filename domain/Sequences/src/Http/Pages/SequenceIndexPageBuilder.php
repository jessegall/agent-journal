<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages;

use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Contracts\PageBuilder;
use Domain\Sequences\Http\Pages\Sequences\SequencesIndex;
use Illuminate\Http\Request;

/**
 * The Sequences page with nothing chosen: the stored sequences and Nothing selected.
 */
final readonly class SequenceIndexPageBuilder implements PageBuilder
{
    public function __construct(private SequencesIndex $index) {}

    public function build(Request $visit): SequenceIndexPageData
    {
        return SequenceIndexPageData::build()->shown($this->content())->finish();
    }

    private function content(): DeclaredLayoutData
    {
        return $this->index->of('', []);
    }
}
