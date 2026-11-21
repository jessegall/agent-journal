<?php

declare(strict_types=1);

namespace Tests\Fixtures\ModelWrites\Models;

use Illuminate\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Process\Process;
use Tests\Fixtures\ModelWrites\Models\Concerns\PrunesEveryRow;

/**
 * A model that writes outside its own row in every form the check reports.
 */
final class ForeignWriter extends Model
{
    use PrunesEveryRow;

    public static function renameOldest(string $name): void
    {
        $oldest = self::query()->oldest()->firstOrFail();
        $oldest->name = $name;
        $oldest->save();
    }

    public function closeChildren(): void
    {
        $this->children()->update(['closed' => true]);
    }

    /**
     * @param  list<string>  $ids
     */
    public function tag(array $ids): void
    {
        $this->tags()->attach($ids);
    }

    public static function forgetClosed(): void
    {
        self::query()->where('closed', true)->delete();
    }

    public function logDirectly(): void
    {
        DB::table('logs')->insert(['writer_id' => $this->id]);
    }

    public function addChild(): void
    {
        OwnRowWriter::create('child');
    }

    public function announce(): void
    {
        Container::getInstance()->make(Dispatcher::class)->dispatch(new ForeignWriterChanged());
    }

    public function announceByHelper(): void
    {
        event(new ForeignWriterChanged());
    }

    public function callByName(string $method): void
    {
        $this->{$method}();
    }

    public function export(): void
    {
        $this->runExport();
    }

    /**
     * @return HasMany<OwnRowWriter, $this>
     */
    public function children(): HasMany
    {
        return $this->hasMany(OwnRowWriter::class);
    }

    /**
     * @return BelongsToMany<OwnRowWriter, $this>
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(OwnRowWriter::class);
    }

    private function runExport(): void
    {
        new Process(['true'])->run();
    }
}
