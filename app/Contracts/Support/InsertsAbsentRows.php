<?php

declare(strict_types=1);

namespace App\Contracts\Support;

use App\Contracts\EventSource;
use App\Contracts\RowCapture;
use Illuminate\Container\Container;

/**
 * Inserts a model's new row unless its key is taken, for a row that two requests may make at once: the one that wins
 * keeps it and the other reads it. An event source's inserted row opens its slot in the unit, so its constructor
 * raises its fact only then.
 */
trait InsertsAbsentRows
{
    /**
     * Inserts this new row unless its key is taken, and answers whether it did. The insert reads nothing, so no read
     * scope applies.
     */
    protected function insertIfAbsent(): bool
    {
        if ($this->usesTimestamps()) {
            $this->updateTimestamps();
        }

        $inserted = static::query()->withoutGlobalScopes()->insertOrIgnore($this->getAttributes()) === 1;

        if (! $inserted) {
            return false;
        }

        $this->exists = true;
        $this->wasRecentlyCreated = true;
        $this->syncOriginal();

        if ($this instanceof EventSource) {
            Container::getInstance()->make(RowCapture::class)->persisted($this);
        }

        return true;
    }
}
