<?php

declare(strict_types=1);

namespace App\Data\Agents;

use App\Exceptions\MenuStepRefused;
use App\Values\MenuStep;
use App\Values\NavigationRoundReport;
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
     * The most steps a proven path keeps.
     */
    private const int STEP_LIMIT = 20;

    /**
     * @param  list<string>  $rows
     * @param  list<array<string, mixed>>  $steps  the proven path's steps, when the proof showed
     */
    public function __construct(
        public readonly array $rows,
        public readonly int $highlight,
        public readonly int $generation,
        public readonly bool $hasObservedProof,
        public readonly string|null $refusal = null,
        public readonly array $steps = [],
    ) {}

    /**
     * @throws MenuStepRefused
     */
    public function report(): NavigationRoundReport
    {
        $highlight = $this->highlight >= 0 ? $this->highlight : null;

        if (count($this->steps) > self::STEP_LIMIT) {
            throw MenuStepRefused::tooMany(count($this->steps), self::STEP_LIMIT);
        }

        $steps = array_map(
            fn (int $index, array $step) => MenuStep::fromHost($index + 1, $step),
            array_keys($this->steps),
            $this->steps,
        );

        return new NavigationRoundReport(
            $this->rows,
            $highlight,
            $this->generation,
            $this->hasObservedProof,
            $this->refusal,
            $steps,
        );
    }
}
