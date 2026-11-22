<?php

declare(strict_types=1);

namespace App\Data\Agents;

use App\Enums\NavigationReason;
use App\Values\NavigationScreen;
use App\Values\NavigationUncertainty;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * A host's raise at an uncertain point of a key script run: the stalled request, attempt and step, why, and the
 * stable screen it stopped on, its rows redacted on the host.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class NavigationRaiseData extends Data
{
    /**
     * @param  list<string>  $rows
     * @param  list<string>  $declinedEntries  library entries whose replay failed on this runtime
     * @param  list<string>  $sentSteps  the steps a stale entry's replay already sent, by name
     */
    public function __construct(
        public readonly string $operationKey,
        public readonly string $requestId,
        public readonly int $attempt,
        public readonly int $step,
        public readonly NavigationReason $reason,
        public readonly string $fingerprint,
        public readonly array $rows,
        public readonly int $highlight,
        public readonly int $generation,
        public readonly array $declinedEntries = [],
        public readonly string|null $staleEntry = null,
        public readonly array $sentSteps = [],
    ) {}

    public function uncertainty(): NavigationUncertainty
    {
        $screen = new NavigationScreen(
            $this->rows,
            $this->highlight >= 0 ? $this->highlight : null,
            $this->generation,
        );

        return NavigationUncertainty::fromHost(
            $this->reason,
            $this->step,
            $this->fingerprint,
            $screen,
            $this->staleEntry,
            $this->sentSteps,
        );
    }
}
