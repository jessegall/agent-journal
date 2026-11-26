<?php

declare(strict_types=1);

namespace App\Processes\Commands\CleanProcessOutput;

use App\Bus\Contracts\CommandHandler;
use App\Models\Runs\OutputChunk;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Processes\Enums\CaptureStatus;
use App\Processes\Exceptions\CleanRefused;
use App\Processes\OutputRecorder;
use App\Processes\Values\CleanPreview;
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

        $parts = PartRun::query()->ofRuns($runs->modelKeys())->readLimit(5_000)->get();
        $chunks = OutputChunk::query()->ofPartRuns($parts->modelKeys())->readLimit(100_000)->get();

        $preview = new CleanPreview(
            array_values($runs->modelKeys()),
            array_values($parts->modelKeys()),
            (int) $chunks->sum('length'),
            ! $command->isPreview,
        );

        if ($command->isPreview) {
            return $preview;
        }

        $disk = $this->disks->disk(OutputRecorder::DISK);

        foreach ($chunks as $chunk) {
            $disk->delete($chunk->storage_path);
        }

        foreach ($parts as $part) {
            $part->markCapture(CaptureStatus::Removed);
        }

        return $preview;
    }
}
