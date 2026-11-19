<?php

declare(strict_types=1);

namespace App\Http\Data\Agents;

use App\Agents\Values\NavigationRoundReport;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The host's report of a navigation round: the screen after it, whether the proof showed, and a refusal of the label
 * helper.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class NavigationRoundReportData extends Data
{
    /**
     * @param  list<string>  $rows
     */
    public function __construct(
        public readonly array $rows,
        public readonly int $highlight,
        public readonly int $generation,
        public readonly bool $proofSeen,
        public readonly string|null $refusal = null,
    ) {}

    public function report(): NavigationRoundReport
    {
        $highlight = $this->highlight >= 0 ? $this->highlight : null;

        return new NavigationRoundReport($this->rows, $highlight, $this->generation, $this->proofSeen, $this->refusal);
    }
}
