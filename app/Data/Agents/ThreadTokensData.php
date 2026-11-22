<?php

declare(strict_types=1);

namespace App\Data\Agents;

use App\Commands\RecordThreadTokens\RecordThreadTokensCommand;
use App\Enums\UsageMeasurementType;
use App\Support\Command;
use App\Values\ReportedStart;
use App\Values\ThreadTokens;
use App\Values\UsageSource;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * A thread's token count a host observed: the thread's total so far, the parts of it the driver named and the last
 * turn's total, each part only when it was reported.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class ThreadTokensData extends UsageMeasurementData
{
    public function __construct(
        #[Max(128)]
        public readonly string $threadId,
        #[Min(0)]
        public readonly int $total,
        #[Min(0)]
        public readonly int|null $input,
        #[Min(0)]
        public readonly int|null $cachedInput,
        #[Min(0)]
        public readonly int|null $output,
        #[Min(0)]
        public readonly int|null $reasoningOutput,
        #[Min(0)]
        public readonly int|null $lastTurnTotal,
    ) {
        $this->type = UsageMeasurementType::ThreadTokens;
    }

    public function commandFor(ReportedStart $start, UsageSource $source): Command
    {
        $tokens = new ThreadTokens(
            $this->threadId,
            $this->total,
            $this->input,
            $this->cachedInput,
            $this->output,
            $this->reasoningOutput,
            $this->lastTurnTotal,
            $source,
        );

        return new RecordThreadTokensCommand($start, $tokens);
    }
}
