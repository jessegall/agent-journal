<?php

declare(strict_types=1);

namespace App\Ui\Layout;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The value of a fact as one or more pieces, such as the tasks a task waits for, each with its own label and link.
 */
#[TypeScript]
final class LayoutFactValueData extends Data
{
    /**
     * @param  list<LayoutFactPieceData>  $pieces
     */
    public function __construct(
        #[DataCollectionOf(LayoutFactPieceData::class)]
        public readonly array $pieces,
    ) {}

    /**
     * A fact value of pieces, each a label and, when the viewer may open it, its address.
     *
     * @param  list<array{string, string|null}>  $pieces  each label with its address or none
     */
    public static function of(array $pieces): self
    {
        return new self(array_map(
            fn (array $piece) => $piece[1] === null
                ? new LayoutFactPieceData($piece[0])
                : new LayoutFactPieceData($piece[0], $piece[1]),
            $pieces,
        ));
    }
}
