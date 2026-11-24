<?php

declare(strict_types=1);

namespace App\Data\Agents;

use App\Values\TurnEnd;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * What a host saw when a turn ended, as it reports it.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class TurnEndData extends Data
{
    public function __construct(
        public readonly int|null $exitCode = null,
        public readonly bool $isResultRead = false,
        public readonly string|null $resultSubtype = null,
        public readonly bool $isResultError = false,
        public readonly string|null $model = null,
        public readonly string|null $codexStatus = null,
        public readonly bool|null $composerLeft = null,
        public readonly string|null $problem = null,
    ) {}

    public function turnEnd(): TurnEnd
    {
        return new TurnEnd(
            $this->exitCode,
            $this->isResultRead,
            $this->resultSubtype,
            $this->isResultError,
            $this->model,
            $this->codexStatus,
            $this->composerLeft,
            $this->problem,
        );
    }
}
