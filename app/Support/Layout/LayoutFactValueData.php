<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Web\Creation\Buildable;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The value of a fact as one or more pieces, such as the tasks a task waits for, each with its own label and link.
 */
#[TypeScript]
final class LayoutFactValueData extends Data
{
    /** @use Buildable<LayoutFactValueDataFields> */
    use Buildable;

    protected const string FIELDS = LayoutFactValueDataFields::class;

    /**
     * @param  list<LayoutFactPieceData>  $pieces
     */
    public function __construct(
        #[DataCollectionOf(LayoutFactPieceData::class)]
        public readonly array $pieces,
    ) {}
}
