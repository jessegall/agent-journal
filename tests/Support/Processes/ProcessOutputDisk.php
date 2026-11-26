<?php

declare(strict_types=1);

namespace Tests\Support\Processes;

use App\Processes\OutputRecorder;
use Illuminate\Support\Facades\Storage;

/**
 * A fake process-output disk for a test, with the file funnel's process-output place pointed at the same folder, so
 * what the recorder writes through the funnel is what the disk reads back.
 */
final class ProcessOutputDisk
{
    public static function fake(): void
    {
        Storage::fake(OutputRecorder::DISK);
        config(['filesystems.disks.process-output.root' => Storage::disk(OutputRecorder::DISK)->path('')]);
    }
}
