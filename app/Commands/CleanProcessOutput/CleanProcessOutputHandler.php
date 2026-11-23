<?php

declare(strict_types=1);

namespace App\Commands\CleanProcessOutput;

use App\Contracts\Bus\CommandHandler;
use App\Enums\CaptureState;
use App\Exceptions\CleanRefused;
use App\Models\Runs\OutputChunk;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Support\SpoolRecorder;
use App\Values\CleanPreview;
use Illuminate\Contracts\Filesystem\Factory;

/**
 * Previews or removes the stored output of ended runs; any run that has not ended refuses the whole clean.
 */
final readonly class CleanProcessOutputHandler implements CommandHandler
{
    public function __construct(private Factory $disks) {}

    /**
     * @throws CleanRefused
     */
    public function handle(CleanProcessOutputCommand $command): CleanPreview
    {
        $runs = ProcessRun::query()->acrossActors()->whereKey($command->runIds)->limit(100)->get();

        foreach ($runs as $run) {
            if (! $run->lifecycle->isFinal()) {
                throw CleanRefused::notEnded($run->id);
            }
        }

        $parts = PartRun::query()->whereIn('process_run_id', $runs->modelKeys())->readLimit(5_000)->get();
        $chunks = OutputChunk::query()->whereIn('part_run_id', $parts->modelKeys())->readLimit(100_000)->get();

        $preview = new CleanPreview(
            array_values($runs->modelKeys()),
            array_values($parts->modelKeys()),
            (int) $chunks->sum('length'),
            ! $command->preview,
        );

        if ($command->preview) {
            return $preview;
        }

        $disk = $this->disks->disk(SpoolRecorder::DISK);

        foreach ($chunks as $chunk) {
            $disk->delete($chunk->storage_path);
        }

        foreach ($parts as $part) {
            $part->markCapture(CaptureState::Removed);
        }

        return $preview;
    }
}
