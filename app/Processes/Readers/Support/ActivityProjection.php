<?php

declare(strict_types=1);

namespace App\Processes\Readers\Support;

use App\Processes\Enums\LifecycleState;
use App\Processes\Models\OutputChunk;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\SpoolRecorder;
use App\Processes\Support\StoredOutput;
use App\Processes\Values\PartActivity;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Filesystem\Factory;

/**
 * The generic view of every part of a run, ordinary or check, normal or evidence (doc 21 revision 6, sections 54 and
 * 69): built from the part's lifecycle and its newest committed chunk only. It is no reader: it makes no assessment
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
        $parts = $run->parts()->orderBy('syntax_node')->orderBy('attempt')->readLimit(500)->get();

        return array_values($parts->map(fn (PartRun $part) => $this->ofPart($part))->all());
    }

    public function ofPart(PartRun $part): PartActivity
    {
        $newest = OutputChunk::query()->where('part_run_id', $part->id)->orderByDesc('offset')->first();
        $started = $part->started_at ?? $part->created_at;
        $until = $part->ended_at ?? CarbonImmutable::now();

        return new PartActivity(
            $part->id,
            $part->operation,
            $this->lifecycleOf($part->lifecycle),
            $started === null ? 0 : (int) abs($until->diffInSeconds($started)),
            $part->stream_offsets,
            $newest === null ? '' : $newest->captured_at->toIso8601String(),
            $newest === null ? '' : $this->latestLineOf($newest),
        );
    }

    private function lifecycleOf(LifecycleState $state): string
    {
        return $state === LifecycleState::Draining ? 'finalizing' : $state->value;
    }

    private function latestLineOf(OutputChunk $chunk): string
    {
        $bytes = (string) $this->disks->disk(SpoolRecorder::DISK)->get($chunk->storage_path);
        $lines = array_values(array_filter(explode("\n", $bytes), fn (string $line): bool => trim($line) !== ''));

        return $lines === [] ? '' : $this->output->preview($lines[array_key_last($lines)]);
    }
}
