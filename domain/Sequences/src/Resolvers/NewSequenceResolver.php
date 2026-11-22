<?php

declare(strict_types=1);

namespace Domain\Sequences\Resolvers;

use App\Contracts\PageResolver;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use Domain\Sequences\Data\SequenceEditorPartData;
use Domain\Sequences\Resolvers\Support\SequenceIndexLayout;

/**
 * The sequence editor beside the list for a new sequence: no name and no steps yet, stored on its first save.
 */
final readonly class NewSequenceResolver implements PageResolver
{
    public function __construct(private SequenceIndexLayout $index) {}

    public function read(): DeclaredLayoutData
    {
        $editor = SequenceEditorPartData::from([
            'name' => '',
            'steps' => [],
            'saveAddress' => route('sequences.define-sequence', [], false),
            'method' => 'POST',
            'cancelAddress' => route('sequences.index', [], false),
        ]);

        return $this->index->of(
            '',
            [LayoutPartData::native('editor', LayoutNativeData::of('sequences/SequenceEditor', $editor))],
        );
    }
}
