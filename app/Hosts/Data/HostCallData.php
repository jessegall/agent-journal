<?php

declare(strict_types=1);

namespace App\Hosts\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One call the host makes to the journal, as protocol/host.json writes it: the name of its route, its path with
 * {name} parts, its query fields by their types, the types of its body and its reply, none for a call without one,
 * and the most bytes its body may hold, when the file names a limit.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class HostCallData extends Data
{
    /**
     * @param  array<string, string>  $query
     * @param  array<string, list<int>>  $queryBounds  the least and the most each query field takes, by its name
     */
    public function __construct(
        public readonly string $route,
        public readonly string $path,
        public readonly string|null $body,
        public readonly string|null $reply,
        public readonly array $query = [],
        public readonly int|null $bodyByteLimit = null,
        public readonly array $queryBounds = [],
        public readonly string $method = 'POST',
    ) {}

    /**
     * The names of the path's {name} parts, in order.
     *
     * @return list<string>
     */
    public function pathParts(): array
    {
        $isPart = fn (string $piece, int $index) => $index % 2 === 1;

        return array_values(array_filter($this->pathPieces(), $isPart, ARRAY_FILTER_USE_BOTH));
    }

    /**
     * The path cut at its parts: its literal pieces at even places, each {name} part's name at the odd one after.
     *
     * @return list<string>
     */
    public function pathPieces(): array
    {
        return preg_split('/\{(\w+)\}/', $this->path, -1, PREG_SPLIT_DELIM_CAPTURE) ?: [];
    }
}
