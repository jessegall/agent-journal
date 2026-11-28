<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Web\Creation\Exceptions\MissingFields;
use Spatie\LaravelData\Optional;

final class LayoutFactValueDataFields
{
    /** @var list<array{string, string|null}> */
    private array $pieces;

    /** @param list<array{string, string|null}> $pieces */
    public function pieces(array $pieces): self
    {
        $this->pieces = $pieces;

        return $this;
    }

    /** @param list<array{string, string|null}> $pieces */
    public function linkedPieces(array $pieces): self
    {
        return $this->pieces(array_map(
            static fn (array $piece): LayoutFactPieceData => LayoutFactPieceData::build()
                ->label($piece[0])
                ->href($piece[1] ?? Optional::create())
                ->finish(),
            $pieces,
        ));
    }

    public function finish(): LayoutFactValueData
    {
        if (! isset($this->pieces)) {
            throw MissingFields::forType(LayoutFactValueData::class, 'pieces');
        }

        return new LayoutFactValueData(
            pieces: $this->pieces,
        );
    }
}
