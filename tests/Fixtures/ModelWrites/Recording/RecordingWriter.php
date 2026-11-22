<?php

declare(strict_types=1);

namespace Tests\Fixtures\ModelWrites\Recording;

use App\Contracts\EventSource;
use App\Concerns\RaisesEvents;
use Illuminate\Database\Eloquent\Model;

/**
 * An event-recording model whose quiet writes on its own row the capture cannot see, read by the scan alone.
 *
 * @property string $name
 */
final class RecordingWriter extends Model implements EventSource
{
    use RaisesEvents;

    public function rename(string $name): void
    {
        $this->name = $name;
        $this->save();
    }

    public function renameQuietly(string $name): void
    {
        $this->name = $name;
        $this->saveQuietly();
    }

    public function countVisit(): void
    {
        $this->increment('times');
    }

    public static function insertOnce(string $key): void
    {
        self::query()->insertOrIgnore(['key' => $key]);
    }
}
