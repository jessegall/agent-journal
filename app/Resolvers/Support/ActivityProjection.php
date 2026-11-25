<?php

declare(strict_types=1);

namespace App\Resolvers\Support;

use App\Enums\Runs\LifecycleState;
use App\Models\Runs\OutputChunk;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Support\OutputRecorder;
use App\Support\StoredOutput;
use App\Values\PartActivity;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Filesystem\Factory;

/**
 * The generic view of every part of a run, ordinary or check, normal or evidence: built from the part's lifecycle and its newest committed chunk only. It is no reader: it makes no assessment
 * and never claims a result, and a draining part shows finalizing however far its reader got.
 */
final readonly class ActivityProjection
{
    public function __construct(private Factory $disks, private StoredOutput $output) {}

    /**
     * @return list<PartActivity>
     */
    public function ofRun(ProcessRun $run): array
    {
        $parts = $run->parts()->bySyntaxNodeThenAttempt()->readLimit(500)->get();

        return array_values($parts->map(fn (PartRun $part) => $this->ofPart($part))->all());
    }

    public function ofPart(PartRun $part): PartActivity
    {
        $newest = OutputChunk::query()->ofPartRun($part->id)->byOffsetDescending()->first();
        $started = $part->started_at ?? $part->created_at;
        $until = $part->ended_at ?? CarbonImmutable::now();

        return new PartActivity(
            $part->id,
            $part->operation,
            $this->lifecycleOf($part->lifecycle),
            $started === null ? 0 : (int) abs($until->diffInSeconds($started)),
            $part->stream_offsets,
            $newest === null ? '' : $newest->captured_at->toIso8601String(),
            $newest === null ? null : $this->latestLineOf($newest),
        );
    }

    private function lifecycleOf(LifecycleState $state): string
    {
        if ($state === LifecycleState::Draining) {
            return 'finalizing';
        }

        return $state->value;
    }

    private function latestLineOf(OutputChunk $chunk): string
    {
        $bytes = (string) $this->disks->disk(OutputRecorder::DISK)->get($chunk->storage_path);
        $lines = array_values(array_filter(explode("\n", $bytes), fn (string $line) => trim($line) !== ''));

        if ($lines === []) {
            return '';
        }

        return $this->output->preview($lines[array_key_last($lines)]);
    }
}
